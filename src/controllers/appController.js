const User = require('../models/User');
const Message = require('../models/Message');
const Interest = require('../models/Interest');
const ProfileView = require('../models/ProfileView');
const Subscription = require('../models/Subscription');
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

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


// ─────────────────────────────────────────────────────────────────────────────
// GET /chat/messages?sender_id=&receiver_id=
// Returns all messages between two users, sorted oldest → newest
// ─────────────────────────────────────────────────────────────────────────────
exports.getMessages = async (req, res, next) => {
  try {
    const { sender_id, receiver_id } = req.query;

    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: 'sender_id and receiver_id are required',
      });
    }

    const messages = await Message.find({
      $or: [
        { sender_id: sender_id, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    }).sort({ createdAt: 1 });

    // Auto-mark messages as read when fetched by receiver
    await Message.updateMany(
      { sender_id: receiver_id, receiver_id: sender_id, is_read: false },
      { $set: { is_read: true } }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /chat/send
// Body: { sender_id, receiver_id, message }
// ─────────────────────────────────────────────────────────────────────────────
exports.sendMessage = async (req, res, next) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'sender_id, receiver_id, and message are required',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    const newMsg = await Message.create({
      sender_id,
      receiver_id,
      message: message.trim(),
      is_read: false,
    });

    res.json({ success: true, data: newMsg });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /chat/list?user_id=
// Returns one entry per conversation partner with:
//   _id, name, profile_img, lastMessage, lastSenderId, lastTime, unreadCount, isSeen
// ─────────────────────────────────────────────────────────────────────────────
exports.getChatList = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required',
      });
    }

    // Support both ObjectId and string-stored IDs
    const uid = toObjectId(user_id);
    const matchCondition = uid
      ? {
        $or: [
          { sender_id: uid },
          { receiver_id: uid },
          { sender_id: user_id },   // fallback for string-stored IDs
          { receiver_id: user_id },
        ],
      }
      : {
        $or: [{ sender_id: user_id }, { receiver_id: user_id }],
      };

    const chats = await Message.aggregate([
      // Step 1: Match all messages involving this user
      { $match: matchCondition },

      // Step 2: Sort newest first so $first in group gives latest message
      { $sort: { createdAt: -1 } },

      // Step 3: Group by the other person in the conversation
      {
        $group: {
          _id: {
            $cond: [
              {
                $or: [
                  { $eq: ['$sender_id', uid] },
                  { $eq: ['$sender_id', user_id] },
                ],
              },
              '$receiver_id',
              '$sender_id',
            ],
          },
          lastMessage: { $first: '$message' },
          lastSenderId: { $first: '$sender_id' },
          lastTime: { $first: '$createdAt' },
          isSeen: { $first: { $cond: ['$is_read', '1', '0'] } },

          // Count unread messages sent TO this user
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ['$receiver_id', uid] },
                        { $eq: ['$receiver_id', user_id] },
                      ],
                    },
                    { $eq: ['$is_read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      // Step 4: Look up partner's user document
      {
        $lookup: {
          from: 'users',
          let: { partnerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$partnerId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$partnerId' }] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'user',
        },
      },

      // Step 5: Unwind — skip if user not found (deleted accounts)
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },

      // Step 6: Shape the response
      {
        $project: {
          _id: 1,
          name: '$user.name',
          profile_img: '$user.profile_img',
          lastMessage: 1,
          lastSenderId: 1,
          lastTime: 1,
          isSeen: 1,
          unreadCount: 1,
        },
      },

      // Step 7: Sort by most recent conversation first
      { $sort: { lastTime: -1 } },
    ]);

    res.json({ success: true, data: chats });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /chat/read
// Body: { sender_id, receiver_id }
// Also supports GET /chat/read?sender_id=&receiver_id= for backward compat
// ─────────────────────────────────────────────────────────────────────────────
exports.markAsRead = async (req, res, next) => {
  try {
    // Accept from body (POST) or query string (GET)
    const sender_id = req.body.sender_id || req.query.sender_id;
    const receiver_id = req.body.receiver_id || req.query.receiver_id;

    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: 'sender_id and receiver_id are required',
      });
    }

    await Message.updateMany(
      { sender_id, receiver_id, is_read: false },
      { $set: { is_read: true } }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /chat/unread?user_id=
// Returns total unread count for the user across all conversations
// ─────────────────────────────────────────────────────────────────────────────
exports.getUnreadCount = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    const count = await Message.countDocuments({
      receiver_id: user_id,
      is_read: false,
    });

    res.json({ success: true, unread: count });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /chat/message/:message_id
// Deletes a single message by ID
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteMessage = async (req, res, next) => {
  try {
    const { message_id } = req.params;

    if (!message_id) {
      return res.status(400).json({ success: false, message: 'message_id is required' });
    }

    const deleted = await Message.findByIdAndDelete(message_id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /chat/delete
// Body: { user1, user2 }
// Deletes entire conversation between two users
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteChat = async (req, res, next) => {
  try {
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
      return res.status(400).json({ success: false, message: 'user1 and user2 are required' });
    }

    await Message.deleteMany({
      $or: [
        { sender_id: user1, receiver_id: user2 },
        { sender_id: user2, receiver_id: user1 },
      ],
    });

    res.json({ success: true, message: 'Chat deleted' });
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
    console.log("BODY:", req.body);

    const { profile_id, viewer_id } = req.body;

    if (!profile_id || !viewer_id) {
      return res.status(400).json({
        success: false,
        message: "profile_id and viewer_id required"
      });
    }

    await ProfileView.create({ profile_id, viewer_id });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 🔹 WHO VIEWED MY PROFILE
exports.whoViewedMyProfile = async (req, res, next) => {
  try {
    const { profile_id, limit = 10, offset = 0 } = req.query;

    if (!profile_id) {
      return res.status(400).json({ success: false, message: "profile_id required" });
    }

    const data = await ProfileView.find({ profile_id })
      .populate("viewer_id", "name age city occupation profile_img gender state")
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const formatted = data
      .map(item => {
        const viewer = item.viewer_id;
        if (!viewer) return null;

        return {
          user_id: viewer._id,
          name: viewer.name,
          age: viewer.age,
          city: viewer.city,
          state: viewer.state,
          occupation: viewer.occupation,
          gender: viewer.gender,
          profile_img: viewer.profile_img,
          last_viewed_at: item.createdAt,
        };
      })
      .filter(Boolean);

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

//Filter method

exports.filterProfiles = async (req, res) => {
  try {
    const {
      from_age,
      to_age,
      higherEducation,
      employeeIn,
      city,
      from_income,
      to_income,
      gender,
      religion,
      caste,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      isActive: true,
    };

    // AGE FILTER
    if (from_age || to_age) {
      query.age = {};

      if (from_age) {
        query.age.$gte = Number(from_age);
      }

      if (to_age) {
        query.age.$lte = Number(to_age);
      }
    }

    // EDUCATION FILTER
    if (higher_education) {
      query.higherEducation = higher_education;
    }

    if (employee_in) {
      query.employeeIn = employee_in;
    }

    if (city) {
      query.city = city;
    }

    if (from_income || to_income) {
      query.annualIncome = {};

      if (from_income) {
        query.annualIncome.$gte = Number(from_income);
      }

      if (to_income) {
        query.annualIncome.$lte = Number(to_income);
      }
    }

    // PAGINATION
    const skip = (Number(page) - 1) * Number(limit);

    const profiles = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: profiles,
    });
  } catch (error) {
    console.log("Filter API Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to filter profiles",
      error: error.message,
    });
  }
};


// 🔹 UPLOAD IMAGE
exports.uploadProfileImage = async (req, res, next) => {
  try {
    const user_id = req.query.user_id || req.body.user_id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imageUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          profile_img: imageUrl,
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      image_url: imageUrl,
      profile_img: imageUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};