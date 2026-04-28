const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appController');
const upload = require('../middleware/upload');

// APIs
router.get('/religionList', ctrl.getReligions);
router.get('/state_list', ctrl.getStates);

router.get('/annual-income', ctrl.getAnnualIncome);
router.get('/districts', ctrl.getDistricts);
router.get('/districts-by-state', ctrl.getDistrictsByState);

router.get('/subscription_plan_list', ctrl.getSubscriptionPlans);
router.get('/subscription', ctrl.purchaseSubscription);
router.get('/subscription_status', ctrl.getSubscriptionStatus);

router.get('/matching_profile', ctrl.getMatchingProfiles);

router.get('/get_messages', ctrl.getMessages);
router.get('/send_message', ctrl.sendMessage);

router.get('/profile_fetch', ctrl.getProfile);
router.get('/profile_update', ctrl.updateProfile);

router.get('/activate_user', ctrl.activateUser);
router.get('/de_activete_user', ctrl.deactivateUser);

router.get('/send_interest', ctrl.sendInterest);
router.post('/respond_interest', ctrl.respondInterest);
router.get('/received_interests', ctrl.getReceivedInterests);
router.get('/sent_interests', ctrl.getSentInterests);

router.get('/who_viewed_my_profile', ctrl.whoViewedMyProfile);
router.get('/recently_viewed_profiles', ctrl.recentlyViewedProfiles);       // ✅ was undefined
router.get('/who_viewed_profile_recently', ctrl.whoViewedProfileRecently);  // ✅ add this missing route

router.post('/uploadProfileImage', upload.single('profile_img'), ctrl.uploadProfileImage);


module.exports = router;