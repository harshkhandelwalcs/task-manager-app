require('../src/db/mongoose');
const User = require('../src/models/user');

// 5ec4a05f549531aacdf25b90

// User.findByIdAndUpdate('5ec4a05f549531aacdf25b90', { age: 1 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
// }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id), { age };
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('5ec4a05f549531aacdf25b90', 2).then((count) => {
    console.log(count)
}).then((e) => {
    console.log(e);
})