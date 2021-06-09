export const getDaysBetweenDates = (dayName:string) => {

    let result = [];
    let date = new Date();
    let current = new Date(date. getFullYear(), date. getMonth(), 1);
    let final = new Date(date. getFullYear(), date. getMonth() + 1, 0);
    let days : {[key:string] : number} = {D:0,L:1,K:2,M:3,J:4,V:5,S:6};
    let day = days[dayName];
    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
    
    while (current <= final) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
    }
    return result;  
}