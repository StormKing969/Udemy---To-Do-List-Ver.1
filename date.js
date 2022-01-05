// console.log(module);

// required to send a local file
module.exports = getCurrentDate;

function getCurrentDate() {
    let today = new Date();
    
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);
    
    return day;
}
