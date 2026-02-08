# Specification

## Summary
**Goal:** Extend the User Guide page with an Admin-specific guide that is only visible to authenticated admin users, including a new admin illustration.

**Planned changes:**
- Add a new "For Admins" tab/section to the existing User Guide page that appears only when the current user is an admin (using existing admin-detection utilities/hooks).
- Write step-by-step Admin guide content in clear English, including guidance for: accessing admin-only navigation, viewing/updating Company Account/bank details, and understanding admin access restrictions.
- Add and display a new static admin illustration asset at the top of the Admin guide section, styled consistently with the existing Buyer/Seller guide illustrations and containers, with meaningful English alt text.

**User-visible outcome:** Admin users see an additional "For Admins" guide on the User Guide page with an illustration and step-by-step instructions; non-admin (and anonymous) users only see the existing Buyer and Seller guides.
