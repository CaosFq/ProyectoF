const Meal = require("./meal.model")
const Orders = require("./order.model")
const Restaurant = require("./restaurant.model")
const Review = require("./review.model")
const User = require("./user.model")

const initModel = () => {
    /* 1 user <--------> M review */
    User.hasMany(Review)
    Review.belongsTo(User)

    /* 1 user <--------> M orders */
    User.hasMany(Orders)
    Orders.belongsTo(User)

    /* 1 restaurant <--------> M review */
    Restaurant.hasMany(Review)
    Review.belongsTo(Restaurant)

    /* 1 restaurant <--------> M meals */
    Restaurant.hasMany(Meal)
    Meal.belongsTo(Restaurant)

    /* 1 meals <--------> 1 orders */
    Meal.hasOne(Orders)
    Orders.belongsTo(Meal)
}

module.exports = initModel