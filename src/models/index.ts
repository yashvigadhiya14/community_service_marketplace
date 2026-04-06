import ServiceAvailability from "./ServiceAvailability.js";
import Booking from "./bookingModel.js";
import Review from "./reviewModel.js";
import User from "./userModel.js"
import Service from "./serviceModel.js";
import ServiceCategory from "./service_category.js";



Service.hasMany(ServiceAvailability, {
  foreignKey: "service_id",
  as: "availabilitySlots"
});

ServiceAvailability.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service"
});

Booking.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

Service.hasMany(Booking, {
  foreignKey: "service_id",
  as: "bookings",
});

Service.hasMany(Review, { foreignKey: "service_id" });
Review.belongsTo(Service, { foreignKey: "service_id" });

User.hasMany(Review, { foreignKey: "customer_id" });
Review.belongsTo(User, { foreignKey: "customer_id" });

Service.belongsTo(User, {
  foreignKey: "provider_id",
  as: "provider",
});

User.hasMany(Service, {
  foreignKey: "provider_id",
  as: "services",
});

Service.belongsTo(ServiceCategory, {
  foreignKey: "category_id",
  as: "category",
});

ServiceCategory.hasMany(Service, {
  foreignKey: "category_id",
  as: "services",
});

export {
  Service,
  ServiceAvailability,
  Booking,
  User,
  ServiceCategory,
  Review
};