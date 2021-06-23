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
export const getMonthBlockIndex = (date : any) => {

    let day = date.getDate();
  
    if (day >= 30)
        return 2;
  
    return Math.round((day - 1) / 10);
  } 
  
export const getRangeDates = (blockDays : any) => {

    //Existen 3 bloques de dias 
    //Los bloques son de cada 10 dias
    //Obtener dia numero 1 del mes actual
    let initialDate = new Date();
    initialDate =  new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    let finalDate = new Date();
    finalDate = new Date(finalDate.getFullYear(), finalDate.getMonth(), 1);

    //Poner la fecha incial segun el bloque
    // bloque 0 = 1  =  0 + 1
    // bloque 1 = 11 = 10 + 1
    // bloque 2 = 21 = 20 + 1
    initialDate.setDate(blockDays*10 + initialDate.getDate());
    
    //Poner la fecha final segun el bloque
    // bloque 0 = 10          = 10 + 0*10
    // bloque 1 = 20          = 10 + 1*10
    // bloque 2 = 28-29-30-31 = ?Metodo
    
    if(blockDays > 1){
        //Debo obtener todos los dias del 20 hasta el final de mes
        finalDate = new Date(finalDate.getFullYear(), finalDate.getMonth() + 1, 0);
    }else{
        finalDate.setDate(10 + blockDays*10);
    }
    return {    initialDate : initialDate,
                finalDate : finalDate

    }
}