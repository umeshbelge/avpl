const express = require('express');
const router = express.Router();
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });

router.get('/data', auth, (req, res) => {
    const dashboardData = {
        stats: [
            { title: 'Total Users', value: '1,234', change: '+12%', changeType: 'increase' },
            { title: 'Active Sessions', value: '567', change: '-2.5%', changeType: 'decrease' },
            { title: 'Revenue', value: '$12,345', change: '+20%', changeType: 'increase' },
            { title: 'New Signups', value: '89', change: '+5%', changeType: 'increase' }
        ],
        recentActivities: [
            { user: 'Alice', action: 'upgraded to Pro', time: '2 hours ago' },
            { user: 'Bob', action: 'completed a task', time: '5 hours ago' },
            { user: 'Charlie', action: 'commented on a post', time: '1 day ago' },
            { user: 'David', action: 'joined a new project', time: '2 days ago' }
        ],
        user: req.user
    };
    res.json(dashboardData);
});

module.exports = router;
