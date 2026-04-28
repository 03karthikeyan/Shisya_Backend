const User = require('../models/User');
const Message = require('../models/Message');
const Interest = require('../models/Interest');
const ProfileView = require('../models/ProfileView');
const Subscription = require('../models/Subscription');
const mongoose = require("mongoose");

// 🔹 RELIGION LIST
exports.getReligions = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        { religion: "Hindu" },
        { religion: "Muslim" },
        { religion: "Christian" }
      ]
    });
  } catch (error) {
    next(error);
  }
};

//Annual Income
exports.getAnnualIncome = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        { entity_name: "Below 1 LPA" },
        { entity_name: "1 - 2 LPA" },
        { entity_name: "2 - 5 LPA" },
        { entity_name: "5 - 10 LPA" },
        { entity_name: "10 - 20 LPA" },
        { entity_name: "20+ LPA" }
      ]
    });
  } catch (error) {
    next(error);
  }
};

//   DISTRICT LIST
exports.getDistricts = async (req, res, next) => {
  try {
    const { state } = req.query;

    let districts = [];

    if (!state || state.trim() === "") {
      // ✅ Return ALL districts
      districts = [
        "Karur",
        "Trichy",
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Salem",
        "Erode"
      ];
    } else if (state === "Tamil Nadu") {
      districts = [
        "Karur",
        "Trichy",
        "Chennai",
        "Coimbatore"
      ];
    } else if (state === "Kerala") {
      districts = [
        "Kochi",
        "Trivandrum",
        "Kozhikode"
      ];
    }

    res.json({
      success: true,
      data: districts.map(d => ({ entity_name: d }))
    });

  } catch (error) {
    next(error);
  }
};


exports.getDistrictsByState = async (req, res, next) => {
  try {
    const { state } = req.query;

    let districts = [];

    if (state === "Tamil Nadu") {
      districts = [
        "Karur",
        "Trichy",
        "Chennai",
        "Coimbatore",
        "Madurai"
      ];
    } else if (state === "Kerala") {
      districts = [
        "Kochi",
        "Trivandrum",
        "Kozhikode"
      ];
    }

    res.json({
      success: true,
      data: districts.map(d => ({ entity_name: d }))
    });

  } catch (error) {
    next(error);
  }
};

// 🔹 STATE LIST
exports.getStates = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        { entity_name: "Tamil Nadu" },
        { entity_name: "Kerala" }
      ]
    });
  } catch (error) {
    next(error);
  }
};


// 🔹 SUBSCRIPTION LIST
exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    const plans = [
      {
        _id: "plan_silver",
        plan_name: "Silver",
        plan_type: "basic",
        price: 999,
        duration_months: 3,
        description: "Get started with basic matrimony features",
        color: "#C0C0C0",
        is_popular: false,
        features: [
          "View 20 profiles per day",
          "Send 10 interests per day",
          "Basic search filters",
          "Chat with matched profiles",
          "Email support"
        ]
      },
      {
        _id: "plan_gold",
        plan_name: "Gold",
        plan_type: "standard",
        price: 1999,
        duration_months: 6,
        description: "Most popular plan for serious matches",
        color: "#FFD700",
        is_popular: true,
        features: [
          "View unlimited profiles",
          "Send 30 interests per day",
          "Advanced search filters",
          "Chat with all profiles",
          "See who viewed your profile",
          "Priority customer support",
          "Profile highlighted in search"
        ]
      },
      {
        _id: "plan_diamond",
        plan_name: "Diamond",
        plan_type: "premium",
        price: 3999,
        duration_months: 12,
        description: "Premium plan with all exclusive features",
        color: "#00BFFF",
        is_popular: false,
        features: [
          "View unlimited profiles",
          "Send unlimited interests",
          "All advanced filters",
          "Instant chat with all profiles",
          "See who viewed your profile",
          "Profile boost — appear on top",
          "Dedicated relationship manager",
          "Background verification badge",
          "24/7 priority support",
          "Horoscope matching feature"
        ]
      }
    ];

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};


// 🔹 PURCHASE SUBSCRIPTION
exports.purchaseSubscription = async (req, res, next) => {
  try {
    console.log("RAW QUERY:", req.query);

    const user_id = (req.query.user_id || '').toString().trim();
    const plan_id = (req.query.plan_id || '').toString().trim();

    console.log("user_id:", `"${user_id}"`);
    console.log("plan_id:", `"${plan_id}"`);

    if (!user_id || !plan_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and plan_id required",
        received: req.query
      });
    }

    const plans = {
      "plan_silver": { plan_name: "Silver", plan_type: "basic", duration_months: 3 },
      "plan_gold": { plan_name: "Gold", plan_type: "standard", duration_months: 6 },
      "plan_diamond": { plan_name: "Diamond", plan_type: "premium", duration_months: 12 }
    };

    const selectedPlan = plans[plan_id];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan_id: "${plan_id}"`,
        valid_plans: Object.keys(plans)
      });
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + selectedPlan.duration_months);

    // ✅ Use $set to force update even if fields not in schema
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          subscription: plan_id,
          subscription_plan: selectedPlan.plan_name,
          subscription_type: selectedPlan.plan_type,
          subscription_start: now,
          subscription_expiry: expiryDate,
          isPremium: true,
        }
      },
      { new: true, strict: false }  // ✅ strict: false saves even unknown fields
    );

    // ✅ Verify it actually saved
    console.log("UPDATED USER subscription:", updatedUser?.subscription);
    console.log("UPDATED USER isPremium:", updatedUser?.isPremium);
    console.log("UPDATED USER expiry:", updatedUser?.subscription_expiry);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User not found: ${user_id}`
      });
    }

    res.json({
      success: true,
      message: "Subscribed successfully",
      plan_id: plan_id,
      plan_name: selectedPlan.plan_name,
      isPremium: true,
      subscription_expiry: expiryDate,
    });

  } catch (error) {
    console.error("purchaseSubscription ERROR:", error.message);
    next(error);
  }
};


// 🔹 SUBSCRIPTION STATUS
exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const user_id = (req.query.user_id || '').toString().trim();

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    // ✅ Use .lean() to get plain JS object with ALL fields including dynamic ones
    const user = await User.findById(user_id).lean();

    console.log("USER SUBSCRIPTION DATA:", {
      subscription: user?.subscription,
      subscription_plan: user?.subscription_plan,
      subscription_expiry: user?.subscription_expiry,
      isPremium: user?.isPremium,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const isExpired = user.subscription_expiry
      ? new Date(user.subscription_expiry) < now
      : true;

    if (isExpired && user.isPremium) {
      await User.findByIdAndUpdate(user_id, { $set: { isPremium: false } });
    }

    const isPremium = !isExpired && user.isPremium === true;

    res.json({
      status: "success",
      success: true,
      isPremium: isPremium,
      subscription: user.subscription || null,
      plan_name: user.subscription_plan || null,
      plan_type: user.subscription_type || null,
      subscription_start: user.subscription_start || null,
      subscription_expiry: user.subscription_expiry || null,
      is_expired: isExpired,
      days_remaining: isPremium
        ? Math.ceil((new Date(user.subscription_expiry) - now) / (1000 * 60 * 60 * 24))
        : 0,
    });

  } catch (error) {
    console.error("getSubscriptionStatus ERROR:", error.message);
    next(error);
  }
};

// 🔹 MATCHING PROFILES
exports.getMatchingProfiles = async (req, res, next) => {
  try {
    const { user_id, ...filters } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    // ✅ Get user
    const currentUser = await User.findById(user_id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ Opposite gender
    let oppositeGender = "";

    if (currentUser.gender?.toLowerCase() === "male") {
      oppositeGender = "Female";
    } else if (currentUser.gender?.toLowerCase() === "female") {
      oppositeGender = "Male";
    }

    // ✅ Query
    let query = {
      gender: oppositeGender,
      _id: { $ne: user_id }
    };

    // ✅ Filters
    if (filters.from_age && filters.to_age) {
      query.age = {
        $gte: Number(filters.from_age),
        $lte: Number(filters.to_age)
      };
    }

    if (filters.city) {
      query.city = filters.city;
    }

    // ✅ Fetch users
    const users = await User.find(query);

    // ✅ ADD THIS 👇
    res.json({
      success: true,
      total_matches: users.length,   // 🔥 IMPORTANT
      data: users
    });

  } catch (error) {
    next(error);
  }
};

// 🔹 GET MESSAGES
exports.getMessages = async (req, res, next) => {
  try {
    const { sender_id, receiver_id } = req.query;

    const messages = await Message.find({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id }
      ]
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};


// 🔹 SEND MESSAGE
exports.sendMessage = async (req, res, next) => {
  try {
    const { sender_id, receiver_id, message } = req.query;

    await Message.create({ sender_id, receiver_id, message });

    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    next(error);
  }
};


// 🔹 PROFILE FETCH
exports.getProfile = async (req, res, next) => {
  try {
    const user_id = (req.query.user_id || '').toString().trim();

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id required"
      });
    }

    const user = await User.findById(user_id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("isActive from DB:", user.isActive); // ✅ debug

    // ✅ Build full image URL
    const imageUrl = user.profile_img
      ? `${req.protocol}://${req.get('host')}/uploads/profile_images/${user.profile_img}`
      : null;

    res.json({
      status: "success",
      success: true,
      user_data: {
        ...user,
        isActive: user.isActive ?? true, // ✅ read directly from DB field
        profile_img: user.profile_img || null,   // filename
        profile_img_url: imageUrl,                    // ✅ full URL for flutter
      },
      badge: user.badge || ""
    });

  } catch (error) {
    next(error);
  }
};


// 🔹 UPDATE PROFILE
exports.updateProfile = async (req, res, next) => {
  try {
    const user_id = req.query.user_id || req.body.user_id;

    // Merge both query + body
    const data = {
      ...req.query,
      ...req.body
    };

    delete data.user_id;

    const user = await User.findByIdAndUpdate(
      user_id,
      { $set: data },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


// 🔹 ACTIVATE USER
exports.activateUser = async (req, res, next) => {
  try {
    const user_id = (req.query.user_id || '').toString().trim();

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    const user = await User.findByIdAndUpdate(
      user_id,
      { $set: { isActive: true } },  // ✅ $set + correct field only
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Activated — isActive:", user.isActive); // ✅ debug

    res.json({
      success: true,
      message: "User activated",
      isActive: user.isActive  // ✅ return updated value
    });

  } catch (error) {
    next(error);
  }
};


exports.deactivateUser = async (req, res, next) => {
  try {
    const user_id = (req.query.user_id || '').toString().trim();

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    const user = await User.findByIdAndUpdate(
      user_id,
      { $set: { isActive: false } }, // ✅ $set + correct field only
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Deactivated — isActive:", user.isActive); // ✅ debug

    res.json({
      success: true,
      message: "User deactivated",
      isActive: user.isActive  // ✅ return updated value
    });

  } catch (error) {
    next(error);
  }
};

// 🔹 SEND INTEREST
exports.sendInterest = async (req, res, next) => {
  try {
    const { sender_id, receiver_id } = req.query;

    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: "sender_id and receiver_id required",
      });
    }

    const existing = await Interest.findOne({ sender_id, receiver_id });

    if (existing) {
      return res.json({
        success: false,
        message: "Interest already sent",
      });
    }

    await Interest.create({
      sender_id: new mongoose.Types.ObjectId(sender_id),
      receiver_id: new mongoose.Types.ObjectId(receiver_id),
    });

    res.json({ success: true, message: "Interest sent" });
  } catch (error) {
    next(error);
  }
};


// 🔹 RESPOND INTEREST
exports.respondInterest = async (req, res, next) => {
  try {
    const { interest_id, action } = req.body; // ✅ use body (better)

    // ✅ Validation
    if (!interest_id || !action) {
      return res.status(400).json({
        success: false,
        message: "interest_id and action required",
      });
    }

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action (accepted/rejected only)",
      });
    }

    const interest = await Interest.findById(interest_id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest not found",
      });
    }

    // ✅ Update status
    interest.status = action;
    await interest.save();

    res.json({
      success: true,
      message: `Interest ${action}`,
      data: interest,
    });
  } catch (error) {
    next(error);
  }
};

//received all interests list
exports.getReceivedInterests = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id required",
      });
    }

    const interests = await Interest.find({
      receiver_id: user_id,
    })
      .populate("sender_id") // ✅ get sender details
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interests.length,
      data: interests,
    });
  } catch (error) {
    next(error);
  }
};

//send interests list
exports.getSentInterests = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const interests = await Interest.find({
      sender_id: user_id,
    })
      .populate("receiver_id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interests.length,
      data: interests,
    });
  } catch (error) {
    next(error);
  }
};


// 🔹 PROFILE VIEW TRACK
exports.viewProfile = async (req, res, next) => {
  try {
    const { profile_id, viewer_id } = req.query;

    await ProfileView.create({ profile_id, viewer_id });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 🔹 WHO VIEWED MY PROFILE
exports.whoViewedMyProfile = async (req, res, next) => {
  try {
    const { profile_id } = req.query;

    if (!profile_id) {
      return res.status(400).json({ success: false, message: "profile_id required" });
    }

    const data = await ProfileView.find({ profile_id })
      .populate("viewer_id", "name age city occupation profile_img gender state");

    const formatted = data.map(item => {
      const viewer = item.viewer_id || {};
      return {
        user_id: viewer._id || '',
        name: viewer.name || 'Unknown',
        age: viewer.age || '',
        city: viewer.city || '',
        state: viewer.state || '',
        occupation: viewer.occupation || '',
        gender: viewer.gender || '',
        profile_img: viewer.profile_img || '',
        last_viewed_at: item.createdAt || '',
        total_views: 1,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};


// 🔹 RECENTLY VIEWED PROFILES (profiles YOU viewed)
exports.recentlyViewedProfiles = async (req, res, next) => {
  try {
    const { viewer_id } = req.query;

    if (!viewer_id) {
      return res.status(400).json({ success: false, message: "viewer_id required" });
    }

    const data = await ProfileView.find({ viewer_id })
      .populate("profile_id", "name age city occupation profile_img gender state")
      .sort({ createdAt: -1 });

    const formatted = data.map(item => {
      const profile = item.profile_id || {};
      return {
        user_id: profile._id || '',
        name: profile.name || 'Unknown',
        age: profile.age || '',
        city: profile.city || '',
        state: profile.state || '',
        occupation: profile.occupation || '',
        gender: profile.gender || '',
        profile_img: profile.profile_img || '',
        last_viewed_at: item.createdAt || '',
        total_views: 1,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};


// 🔹 WHO VIEWED PROFILE RECENTLY (last 3 days)
exports.whoViewedProfileRecently = async (req, res, next) => {
  try {
    const { profile_id } = req.query;

    if (!profile_id) {
      return res.status(400).json({ success: false, message: "profile_id required" });
    }

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const data = await ProfileView.find({
      profile_id,
      createdAt: { $gte: threeDaysAgo }
    })
      .populate("viewer_id", "name age city occupation profile_img gender state")
      .sort({ createdAt: -1 });

    const formatted = data.map(item => {
      const viewer = item.viewer_id || {};
      return {
        user_id: viewer._id || '',
        name: viewer.name || 'Unknown',
        age: viewer.age || '',
        city: viewer.city || '',
        state: viewer.state || '',
        occupation: viewer.occupation || '',
        gender: viewer.gender || '',
        profile_img: viewer.profile_img || '',
        last_viewed_at: item.createdAt || '',
        total_views: 1,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};


// 🔹 UPLOAD IMAGE
exports.uploadProfileImage = async (req, res, next) => {
  try {
    const user_id = (req.query.user_id || req.body.user_id || '').toString().trim();

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    // ✅ Build image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`;

    // ✅ Save to user
    const user = await User.findByIdAndUpdate(
      user_id,
      { $set: { profile_img: req.file.filename } }, // store filename only
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Profile image saved:", req.file.filename);

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      filename: req.file.filename,
      image_url: imageUrl,
      profile_img: req.file.filename
    });

  } catch (error) {
    console.error("uploadProfileImage ERROR:", error.message);
    next(error);
  }
};