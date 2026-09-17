import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE RAZORPAY SUBSCRIPTION
// ==========================================
// ==========================================
// CREATE / REUSE RAZORPAY SUBSCRIPTION
// ==========================================
export const createSubscription = async (req, res) => {
  try {
    console.log("\n=================================");
    console.log("CREATE / REUSE RAZORPAY SUBSCRIPTION");
    console.log("=================================");

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User:", user.email);
    console.log("Current plan:", user.plan);

    // Already Pro
    if (user.plan === "pro") {
      return res.status(400).json({
        success: false,
        message: "User is already on Pro plan",
      });
    }

    // ------------------------------------------
    // CHECK RAZORPAY CONFIG
    // ------------------------------------------
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET ||
      !process.env.RAZORPAY_PLAN_ID
    ) {
      return res.status(500).json({
        success: false,
        message: "Razorpay configuration is missing",
      });
    }

    // ------------------------------------------
    // TRY TO REUSE EXISTING SUBSCRIPTION
    // ------------------------------------------
    const existingSubscriptionId =
      user.subscription?.razorpaySubscriptionId;

    if (existingSubscriptionId) {
      console.log(
        "Existing Razorpay Subscription:",
        existingSubscriptionId
      );

      try {
        const existingSubscription =
          await razorpay.subscriptions.fetch(
            existingSubscriptionId
          );

        console.log(
          "Existing Subscription Status:",
          existingSubscription.status
        );

        console.log(
          "Existing Subscription Plan:",
          existingSubscription.plan_id
        );

        // ------------------------------------------
        // REUSE CREATED SUBSCRIPTION
        // ------------------------------------------
        if (
          existingSubscription.status === "created" &&
          existingSubscription.plan_id ===
            process.env.RAZORPAY_PLAN_ID
        ) {
          console.log(
            "♻️ Reusing existing Razorpay subscription"
          );

          // Keep DB status synchronized
          user.subscription.status =
            existingSubscription.status;

          user.subscription.razorpaySubscriptionId =
            existingSubscription.id;

          user.subscription.razorpayPlanId =
            existingSubscription.plan_id;

          await user.save();

          return res.status(200).json({
            success: true,
            message: "Existing subscription reused",
            subscriptionId: existingSubscription.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            planId: existingSubscription.plan_id,
          });
        }

        console.log(
          "Existing subscription cannot be reused."
        );
        console.log(
          "Creating a new subscription..."
        );
      } catch (fetchError) {
        console.error(
          "Could not fetch existing subscription:",
          fetchError?.message
        );

        console.log(
          "Creating a new subscription..."
        );
      }
    }

    // ------------------------------------------
    // CREATE NEW RAZORPAY SUBSCRIPTION
    // ------------------------------------------
    console.log(
      "Creating NEW Razorpay subscription..."
    );

    const subscription =
      await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,

        total_count: Number(
          process.env.RAZORPAY_TOTAL_COUNT || 12
        ),

        quantity: 1,

        customer_notify: true,
      });

    console.log(
      "\n========== NEW RAZORPAY RESPONSE =========="
    );

    console.log(
      "Subscription ID:",
      subscription.id
    );

    console.log(
      "Plan ID:",
      subscription.plan_id
    );

    console.log(
      "Status:",
      subscription.status
    );

    console.log(
      "Total Count:",
      subscription.total_count
    );

    console.log(
      "============================================\n"
    );

    // ------------------------------------------
    // SAVE NEW SUBSCRIPTION
    // ------------------------------------------
    user.subscription = {
      provider: "razorpay",

      razorpaySubscriptionId:
        subscription.id,

      razorpayPlanId:
        subscription.plan_id,

      status:
        subscription.status,

      currentPeriodEnd: null,

      startedAt: null,

      cancelledAt: null,

      lastPaymentId: null,
    };

    await user.save();

    console.log(
      "New subscription saved successfully for:",
      user.email
    );

    // ------------------------------------------
    // SEND DATA TO FRONTEND
    // ------------------------------------------
    return res.status(201).json({
      success: true,

      message:
        "Subscription created successfully",

      subscriptionId:
        subscription.id,

      keyId:
        process.env.RAZORPAY_KEY_ID,

      planId:
        subscription.plan_id,
    });

  } catch (error) {

    console.error(
      "\n================================="
    );

    console.error(
      "RAZORPAY CREATE SUBSCRIPTION ERROR"
    );

    console.error(
      "================================="
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status Code:",
      error?.statusCode
    );

    console.error(
      "Error Code:",
      error?.error?.code
    );

    console.error(
      "Error Description:",
      error?.error?.description
    );

    console.error(
      "Error Source:",
      error?.error?.source
    );

    console.error(
      "Error Step:",
      error?.error?.step
    );

    console.error(
      "Error Reason:",
      error?.error?.reason
    );

    console.error(
      "Full Error:",
      JSON.stringify(
        error,
        null,
        2
      )
    );

    console.error(
      "=================================\n"
    );

    return res.status(
      error?.statusCode || 500
    ).json({
      success: false,

      message:
        error?.error?.description ||
        error?.message ||
        "Failed to create Razorpay subscription",

      error:
        error?.error || null,
    });
  }
};

// ==========================================
// VERIFY RAZORPAY SUBSCRIPTION PAYMENT
// ==========================================
export const verifySubscription = async (req, res) => {
  try {
    console.log("\n=================================");
    console.log("VERIFYING RAZORPAY PAYMENT");
    console.log("=================================");

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    // ------------------------------------------
    // CHECK PAYMENT DATA
    // ------------------------------------------

    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature
    ) {
      console.error(
        "Payment verification data is missing"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment verification data is missing",
      });
    }

    console.log(
      "Payment ID:",
      razorpay_payment_id
    );

    console.log(
      "Subscription ID:",
      razorpay_subscription_id
    );

    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------
    // CHECK SUBSCRIPTION OWNERSHIP
    // ------------------------------------------

    if (
      user.subscription?.razorpaySubscriptionId !==
      razorpay_subscription_id
    ) {
      console.error(
        "Subscription ownership mismatch"
      );

      return res.status(403).json({
        success: false,
        message:
          "Subscription does not belong to this user",
      });
    }

    // ------------------------------------------
    // GENERATE EXPECTED SIGNATURE
    // ------------------------------------------

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_payment_id}|${razorpay_subscription_id}`
      )
      .digest("hex");

    // ------------------------------------------
    // COMPARE SIGNATURES
    // ------------------------------------------

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      console.error(
        "Invalid Razorpay payment signature"
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature",
      });
    }

    console.log(
      "Payment signature verified successfully"
    );

    // ------------------------------------------
    // FETCH SUBSCRIPTION FROM RAZORPAY
    // ------------------------------------------

    const subscription =
      await razorpay.subscriptions.fetch(
        razorpay_subscription_id
      );

    console.log(
      "Razorpay subscription status:",
      subscription.status
    );

    // ------------------------------------------
    // VALID SUBSCRIPTION STATES
    // ------------------------------------------

    const validStatuses = [
      "authenticated",
      "active",
    ];

    if (
      !validStatuses.includes(
        subscription.status
      )
    ) {
      console.error(
        "Subscription is not active:",
        subscription.status
      );

      return res.status(400).json({
        success: false,

        message:
          `Subscription is not active. Current status: ${subscription.status}`,
      });
    }

    // ------------------------------------------
    // ACTIVATE PRO
    // ------------------------------------------

    user.plan = "pro";

    user.subscription.status =
      subscription.status;

    user.subscription.lastPaymentId =
      razorpay_payment_id;

    if (subscription.current_start) {
      user.subscription.startedAt =
        new Date(
          subscription.current_start * 1000
        );
    }

    if (subscription.current_end) {
      user.subscription.currentPeriodEnd =
        new Date(
          subscription.current_end * 1000
        );
    }

    await user.save();

    console.log("\n=================================");
    console.log("PRO SUBSCRIPTION ACTIVATED");
    console.log("User:", user.email);
    console.log("Plan:", user.plan);
    console.log(
      "Subscription Status:",
      user.subscription.status
    );
    console.log("=================================\n");

    return res.status(200).json({
      success: true,

      message:
        "Payment verified successfully. Pro activated.",

      plan: user.plan,

      subscription:
        user.subscription,
    });

  } catch (error) {
    console.error("\n=================================");
    console.error("VERIFY SUBSCRIPTION ERROR");
    console.error("=================================");

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.statusCode
    );

    console.error(
      "Error:",
      error?.error
    );

    console.error(
      "Full:",
      JSON.stringify(
        error,
        null,
        2
      )
    );

    console.error(
      "=================================\n"
    );

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Payment verification failed",
    });
  }
};

// ==========================================
// RAZORPAY WEBHOOK
// ==========================================
export const razorpayWebhook = async (
  req,
  res
) => {
  try {
    console.log("\n=================================");
    console.log("RAZORPAY WEBHOOK RECEIVED");
    console.log("=================================");

    // ------------------------------------------
    // WEBHOOK SECRET
    // ------------------------------------------

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is not configured"
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook secret is not configured",
      });
    }

    // ------------------------------------------
    // GET RAZORPAY SIGNATURE
    // ------------------------------------------

    const receivedSignature =
      req.headers[
        "x-razorpay-signature"
      ];

    if (!receivedSignature) {
      console.error(
        "Webhook signature missing"
      );

      return res.status(400).json({
        success: false,
        message:
          "Webhook signature missing",
      });
    }

    // ------------------------------------------
    // GENERATE WEBHOOK SIGNATURE
    // ------------------------------------------

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        webhookSecret
      )
      .update(req.body)
      .digest("hex");

    // ------------------------------------------
    // VERIFY WEBHOOK SIGNATURE
    // ------------------------------------------

    if (
      expectedSignature !==
      receivedSignature
    ) {
      console.error(
        "Invalid Razorpay webhook signature"
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid webhook signature",
      });
    }

    console.log(
      "Webhook signature verified"
    );

    // ------------------------------------------
    // PARSE WEBHOOK BODY
    // ------------------------------------------

    const payload = JSON.parse(
      req.body.toString()
    );

    const event = payload.event;

    console.log(
      "Webhook Event:",
      event
    );

    // ------------------------------------------
    // SUBSCRIPTION ENTITY
    // ------------------------------------------

    const subscriptionEntity =
      payload?.payload?.subscription?.entity;

    // ------------------------------------------
    // PAYMENT ENTITY
    // ------------------------------------------

    const paymentEntity =
      payload?.payload?.payment?.entity;

    // ------------------------------------------
    // LOG PAYMENT FAILURE
    // ------------------------------------------

    if (
      event === "payment.failed"
    ) {
      console.error(
        "\n================================="
      );

      console.error(
        "RAZORPAY PAYMENT FAILED"
      );

      console.error(
        "================================="
      );

      console.error(
        "Payment ID:",
        paymentEntity?.id
      );

      console.error(
        "Amount:",
        paymentEntity?.amount
      );

      console.error(
        "Method:",
        paymentEntity?.method
      );

      console.error(
        "Error Code:",
        paymentEntity?.error_code
      );

      console.error(
        "Error Description:",
        paymentEntity?.error_description
      );

      console.error(
        "Error Source:",
        paymentEntity?.error_source
      );

      console.error(
        "Error Step:",
        paymentEntity?.error_step
      );

      console.error(
        "Error Reason:",
        paymentEntity?.error_reason
      );

      console.error(
        "Full Payment Entity:",
        JSON.stringify(
          paymentEntity,
          null,
          2
        )
      );

      console.error(
        "=================================\n"
      );

      return res.status(200).json({
        success: true,
        message:
          "Payment failure webhook received",
      });
    }

    // ------------------------------------------
    // CHECK SUBSCRIPTION ENTITY
    // ------------------------------------------

    if (
      !subscriptionEntity?.id
    ) {
      console.log(
        "No subscription entity found"
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook received",
      });
    }

    const subscriptionId =
      subscriptionEntity.id;

    console.log(
      "Subscription ID:",
      subscriptionId
    );

    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    const user = await User.findOne({
      "subscription.razorpaySubscriptionId":
        subscriptionId,
    });

    if (!user) {
      console.log(
        "Webhook received for unknown subscription:",
        subscriptionId
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook received",
      });
    }

    console.log(
      "User found:",
      user.email
    );

    // ==========================================
    // SUBSCRIPTION AUTHENTICATED / ACTIVATED
    // ==========================================

    if (
      event ===
        "subscription.authenticated" ||
      event ===
        "subscription.activated" ||
      event ===
        "subscription.charged"
    ) {
      user.plan = "pro";

      user.subscription.status =
        subscriptionEntity.status;

      if (
        subscriptionEntity.current_start
      ) {
        user.subscription.startedAt =
          new Date(
            subscriptionEntity.current_start *
              1000
          );
      }

      if (
        subscriptionEntity.current_end
      ) {
        user.subscription.currentPeriodEnd =
          new Date(
            subscriptionEntity.current_end *
              1000
          );
      }

      // Payment entity may be present
      // for subscription.charged

      if (paymentEntity?.id) {
        user.subscription.lastPaymentId =
          paymentEntity.id;
      }

      console.log(
        "Subscription activated for:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION ENDED / STOPPED
    // ==========================================

    if (
      event ===
        "subscription.cancelled" ||
      event ===
        "subscription.completed" ||
      event ===
        "subscription.halted"
    ) {
      user.plan = "free";

      user.subscription.status =
        subscriptionEntity.status;

      if (
        subscriptionEntity.ended_at
      ) {
        user.subscription.cancelledAt =
          new Date(
            subscriptionEntity.ended_at *
              1000
          );
      }

      console.log(
        "Subscription ended for:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION PAUSED
    // ==========================================

    if (
      event ===
      "subscription.paused"
    ) {
      user.subscription.status =
        subscriptionEntity.status;

      console.log(
        "Subscription paused:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION RESUMED
    // ==========================================

    if (
      event ===
      "subscription.resumed"
    ) {
      user.plan = "pro";

      user.subscription.status =
        subscriptionEntity.status;

      console.log(
        "Subscription resumed:",
        user.email
      );
    }

    // ------------------------------------------
    // SAVE USER
    // ------------------------------------------

    await user.save();

    console.log(
      `Razorpay webhook processed successfully: ${event}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Webhook processed",
    });

  } catch (error) {
    console.error("\n=================================");
    console.error("RAZORPAY WEBHOOK ERROR");
    console.error("=================================");

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Full Error:",
      JSON.stringify(
        error,
        null,
        2
      )
    );

    console.error(
      "=================================\n"
    );

    return res.status(500).json({
      success: false,

      message:
        "Webhook processing failed",
    });
  }
};