require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5ec4a32420afd8ada1142843').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})


const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteTaskAndCount('5ec4a32420afd8ada1142843').then((count) => {
    console.log(count);
}).then((e) => {
    console.log(e);
})