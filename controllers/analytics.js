const moment = require('moment');
const Order = require('./../models/Order');
const errorHandler = require('./../utils/errorHandler');


module.exports.overview = async (req, res) => {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({
            date: 1
        });
        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
        // yesterday orders quantity
        const yesterdayOrdersNumber = yesterdayOrders.length;
        // orders quantity
        const totalOrdersNumber = allOrders.length;
        // days number
        const daysNumber = Object.keys(ordersMap).length;
        // orders per day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(1);
        // percent for orders quantity
        // ((orders yesterday / orders per day) - 1)*100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
        // General profit
        const totalGain = calculatePrice(allOrders);
        // profit per day
        const gainPerDay = totalGain / daysNumber;
        // yesterday profit
        const yesterdayGain = calculatePrice(yesterdayOrders);
        // profit percent
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
        // profit comparison
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
        // orders quantity comparison
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        });
    } catch (error) {
        errorHandler(res, e);
    }
}

module.exports.analytics = async (req, res) => {
    try {
        const allOrders = await Order.find({user: req.user.id})
            .sort({
                date: 1
            });
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
        const chart = Object.keys(ordersMap).map(label => {
            // label == 05.05.2018
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;
            return {
                label,
                order,
                gain
            }
        });
        res.status(200).json({ average, chart });
    } catch (error) {
        errorHandler(res, error);
    }
}

function getOrdersMap(orders = []) {
    const daysOrder = {};
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');

        if (date === moment().format('DD.MM.YYYY')) {
            return;
        }
        if (!daysOrder[date]) {
            daysOrder[date] = [];
        }
        daysOrder[date].push(order);
    });

    return daysOrder;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0);
        return total += orderPrice;
    },0);
}