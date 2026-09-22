import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE / REUSE RAZORPAY SUBSCRIPTION
// =====================================================

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

    // ------------------------------------------
    // ALREADY PRO
    // ------------------------------------------
    if (user.plan === "pro") {
      return res.status(400).json({
        success: false,
        message: "User is already on Pro plan",
      });
    }

    // ------------------------------------------
    // CHECK RAZORPAY CONFIG
    // ------------------------------------------
    const {
      RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET,
      RAZORPAY_PLAN_ID,
    } = process.env;

    if (
      !RAZORPAY_KEY_ID ||
      !RAZORPAY_KEY_SECRET ||
      !RAZORPAY_PLAN_ID
    ) {
      return res.status(500).json({
        success: false,
        message: "Razorpay configuration is missing",
      });
    }

    // ------------------------------------------
    // CHECK EXISTING SUBSCRIPTION
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
        // REUSE ONLY VALID SUBSCRIPTION
        // ------------------------------------------
        if (
          existingSubscription.plan_id ===
            RAZORPAY_PLAN_ID &&
          ["authenticated", "active"].includes(
            existingSubscription.status
          )
        ) {
          console.log(
            "♻️ Reusing existing Razorpay subscription"
          );

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
            subscriptionId:
              existingSubscription.id,
            keyId: RAZORPAY_KEY_ID,
            planId: existingSubscription.plan_id,
          });
        }

        // ------------------------------------------
        // OLD CREATED / CANCELLED / EXPIRED
        // SUBSCRIPTION WILL NOT BE REUSED
        // ------------------------------------------
        console.log(
          "Existing subscription cannot be reused."
        );

        console.log(
          "Existing status:",
          existingSubscription.status
        );

        console.log(
          "Creating a completely new subscription..."
        );
      } catch (fetchError) {
        console.warn(
          "Could not fetch existing subscription:",
          fetchError?.message
        );

        console.log(
          "Creating a completely new subscription..."
        );
      }
    }

    // ------------------------------------------
    // CREATE NEW SUBSCRIPTION
    // ------------------------------------------

    console.log(
      "Creating NEW Razorpay subscription..."
    );

    const totalCount = Number(
      process.env.RAZORPAY_TOTAL_COUNT || 12
    );

    const subscription =
      await razorpay.subscriptions.create({
        plan_id: RAZORPAY_PLAN_ID,

        total_count: totalCount,

        quantity: 1,

        customer_notify: true,
      });

    // ------------------------------------------
    // LOG RAZORPAY RESPONSE
    // ------------------------------------------

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
      "Start At:",
      subscription.start_at
    );

    console.log(
      "Charge At:",
      subscription.charge_at
    );

    console.log(
      "Total Count:",
      subscription.total_count
    );

    console.log(
      "Customer ID:",
      subscription.customer_id
    );

    console.log(
      "============================================\n"
    );

    // ------------------------------------------
    // SAVE SUBSCRIPTION IN USER
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
        RAZORPAY_KEY_ID,

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

    const expectedBuffer = Buffer.from(generatedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
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
    // FETCH PAYMENT + SUBSCRIPTION
    // ------------------------------------------
    // IMPORTANT:
    // In Subscription Checkout, the payment_id returned to the
    // frontend can represent the mandate/authentication entry
    // and may be `authorized` (often ₹0), while the actual
    // subscription charge is captured separately.
    // Therefore, do not reject the whole subscription only
    // because this particular payment_id is authorized.

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    const subscription =
      await razorpay.subscriptions.fetch(
        razorpay_subscription_id
      );

    console.log(
      "Razorpay payment status:",
      payment.status
    );

    console.log(
      "Razorpay payment amount:",
      payment.amount
    );

    console.log(
      "Razorpay subscription status:",
      subscription.status
    );

    console.log(
      "Razorpay subscription paid_count:",
      subscription.paid_count
    );

    // A captured payment is immediately acceptable.
    // If Checkout returned an authorized mandate payment, only
    // continue when Razorpay also confirms that the subscription
    // has at least one paid cycle. This avoids granting Pro just
    // because a ₹0 mandate authorization exists.
    // ------------------------------------------
// CHECK SUBSCRIPTION PAYMENT
// ------------------------------------------


// ------------------------------------------
// VERIFY ACTUAL SUBSCRIPTION INVOICE
// ------------------------------------------

const invoices = await razorpay.invoices.all({
  subscription_id: razorpay_subscription_id,
});

console.log(
  "Subscription invoices:",
  invoices?.items?.map((invoice) => ({
    id: invoice.id,
    status: invoice.status,
    paymentId: invoice.payment_id,
    amount: invoice.amount,
    amountPaid: invoice.amount_paid,
  }))
);

const paidInvoice = invoices?.items?.find(
  (invoice) =>
    invoice.status === "paid" &&
    Number(invoice.amount_paid || 0) > 0
);

const actualPaymentId = paidInvoice?.payment_id;

let actualPayment = null;

if (actualPaymentId) {
  actualPayment =
    await razorpay.payments.fetch(actualPaymentId);

  console.log(
    "Actual subscription payment:",
    {
      paymentId: actualPayment.id,
      status: actualPayment.status,
      amount: actualPayment.amount,
    }
  );
}

// ------------------------------------------
// CONFIRM REAL PAYMENT
// ------------------------------------------

const actualPaymentCaptured =
  actualPayment?.status === "captured" &&
  Number(actualPayment?.amount || 0) > 0;

const subscriptionAlreadyPaid =
  Number(subscription.paid_count || 0) > 0;

const subscriptionIsActive =
  subscription.status === "active";

const subscriptionConfirmed =
  actualPaymentCaptured ||
  subscriptionAlreadyPaid ||
  subscriptionIsActive;

console.log(
  "Final subscription payment check:",
  {
    checkoutPaymentId: razorpay_payment_id,
    checkoutPaymentStatus: payment.status,
    checkoutPaymentAmount: payment.amount,

    actualPaymentId,
    actualPaymentCaptured,

    subscriptionStatus: subscription.status,
    paidCount: subscription.paid_count,

    subscriptionConfirmed,
  }
);

if (!subscriptionConfirmed) {
  console.warn(
    "Actual subscription payment is not confirmed yet."
  );

  return res.status(202).json({
    success: false,
    pending: true,

    // TEMPORARY DEBUG DATA
    debug: {
      subscriptionStatus: subscription?.status,
      paidCount: subscription?.paid_count,
      checkoutPaymentStatus: payment?.status,
      checkoutPaymentAmount: payment?.amount,

      actualPaymentId,
      actualPaymentStatus: actualPayment?.status,
      actualPaymentAmount: actualPayment?.amount,

      actualPaymentCaptured,
      subscriptionAlreadyPaid,
      subscriptionIsActive,
      subscriptionConfirmed,
    },

    message:
      "Subscription payment is being processed. Please wait for Razorpay confirmation.",
  });
}

    // ------------------------------------------
    // ACTIVATE PRO
    // ------------------------------------------

    user.plan = "pro";

    user.subscription.status =
      subscription.status;

    user.subscription.lastPaymentId =
                actualPaymentId || razorpay_payment_id;

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
export const razorpayWebhook = async (req, res) => {
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
        message: "Webhook secret is not configured",
      });
    }

    // ------------------------------------------
    // GET SIGNATURE
    // ------------------------------------------

    const receivedSignature =
      req.headers["x-razorpay-signature"];

    if (!receivedSignature) {
      console.error(
        "Webhook signature missing"
      );

      return res.status(400).json({
        success: false,
        message: "Webhook signature missing",
      });
    }

    // ------------------------------------------
    // VERIFY SIGNATURE
    // IMPORTANT: req.body MUST BE RAW BUFFER
    // ------------------------------------------

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    const expectedBuffer =
      Buffer.from(expectedSignature, "utf8");

    const receivedBuffer =
      Buffer.from(receivedSignature, "utf8");

    if (
      expectedBuffer.length !==
        receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      console.error(
        "Invalid Razorpay webhook signature"
      );

      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    console.log(
      "Webhook signature verified"
    );

    // ------------------------------------------
    // PARSE BODY AFTER SIGNATURE VERIFICATION
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
    // EVENT ID
    // ------------------------------------------

    const eventId =
      req.headers["x-razorpay-event-id"];

    console.log(
      "Webhook Event ID:",
      eventId
    );

    // ------------------------------------------
    // ENTITIES
    // ------------------------------------------

    const subscriptionEntity =
      payload?.payload?.subscription?.entity;

    const paymentEntity =
      payload?.payload?.payment?.entity;

    const subscriptionId =
      subscriptionEntity?.id;

    // ------------------------------------------
    // PAYMENT FAILED
    // ------------------------------------------

    if (event === "payment.failed") {
      console.error(
        "\n================================="
      );

      console.error(
        "RAZORPAY PAYMENT FAILED"
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
        "Error Code:",
        paymentEntity?.error_code
      );

      console.error(
        "Error Description:",
        paymentEntity?.error_description
      );

      console.error(
        "Error Reason:",
        paymentEntity?.error_reason
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
    // NO SUBSCRIPTION
    // ------------------------------------------

    if (!subscriptionId) {
      console.log(
        "No subscription entity found"
      );

      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    }

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
        "Unknown subscription:",
        subscriptionId
      );

      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    }

    console.log(
      "User found:",
      user.email
    );

    // ==========================================
    // SUBSCRIPTION AUTHENTICATED
    // ==========================================

    if (
      event ===
      "subscription.authenticated"
    ) {
      user.subscription.status =
        subscriptionEntity.status;

      console.log(
        "Subscription authenticated:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION ACTIVATED
    // ==========================================

    if (
      event ===
      "subscription.activated"
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

      console.log(
        "Subscription activated:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION CHARGED
    // ==========================================

    if (
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

      if (paymentEntity?.id) {
        user.subscription.lastPaymentId =
          paymentEntity.id;
      }

      console.log(
        "Subscription payment charged:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION PENDING
    // ==========================================

    if (
      event ===
      "subscription.pending"
    ) {
      user.subscription.status =
        subscriptionEntity.status;

      console.log(
        "Subscription pending:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION HALTED
    // ==========================================

    if (
      event ===
      "subscription.halted"
    ) {
      user.plan = "free";

      user.subscription.status =
        subscriptionEntity.status;

      console.log(
        "Subscription halted:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION CANCELLED
    // ==========================================

    if (
      event ===
      "subscription.cancelled"
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
        "Subscription cancelled:",
        user.email
      );
    }

    // ==========================================
    // SUBSCRIPTION COMPLETED
    // ==========================================

    if (
      event ===
      "subscription.completed"
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
        "Subscription completed:",
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
      message: "Webhook processed",
    });

  } catch (error) {
    console.error(
      "\n================================="
    );

    console.error(
      "RAZORPAY WEBHOOK ERROR"
    );

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
      message: "Webhook processing failed",
    });
  }
};