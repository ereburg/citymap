/* jshint esversion: 6 */

class CityMap {

  constructor(options) {
    this.string = options.string
      .replace(/['"«»\s+]/g, '') // удаляем все знаки кавычек и пробелы
      .split(';') // разделяем строку по делителю и собираем в массив
      .filter(Boolean) // фильтруем, если в конце стоит ; , то этот элемент удаляем
      .map(item => ({  // проходимся по каждому элементу массива и преобразуем в объект
        city: item.split(',')[0],  // первому элементу присваиваем ключ и значение первого элемента массива (была строка, ее разбиваем)
        state: item.split(',')[1], // по аналогии
        latitude: +item.split(',')[2],
        longitude: +item.split(',')[3],
        distance: 0
      }));
  }

  get northernmost() {
    let NAME = this.string.reduce( // фактически - избавляемся от элементов, которые не удовлетворяют условию
      (previous, current) => // итерируем каждый элемент
        previous.latitude > current.latitude ?  // условие, если предыдущий элемент больше текущего
          previous : current // то оставляем предыдущий, если нет, присваиваем максимальное значение - текущему
    ).city || 'Undefined by the moment'; // выводим ключ Город текущего элемента

    return `The northernmost city is ${NAME}.`;
  }

  get southernmost() {
    let NAME = this.string.reduce(
      (previous, current) =>
        previous.latitude < current.latitude ?
          previous : current
    ).city || 'Undefined by the moment';

    return `The southernmost city is ${NAME}.`;
  }

  get easternmost() {
    let NAME = this.string.reduce(
      (previous, current) =>
        previous.longitude > current.longitude ?
          previous : current
    ).city || 'Undefined by the moment';

    return `The easternmost city is ${NAME}.`;
  }

  get westernmost() {
    let NAME = this.string.reduce(
      (previous, current) =>
        previous.longitude < current.longitude ?
          previous : current
    ).city || 'Undefined by the moment';

    return `The westernmost city is ${NAME}.`;
  }

  get states() {
    let states_arr = [];
    this.string
      .forEach(item => {
        states_arr.push(item.state);
      });
    states_arr = [...new Set(states_arr)].join(' ');
    return states_arr;
  }

  citiesInState(state_name) {
    let state_cities = [];
    this.string.filter(item => {
      return (item.state === state_name) ? state_cities.push(item.city) : false;
    });
    return state_cities;
  }

  closestCity(la, lg) {
    this.string
      .forEach(el => {
        let el_la = el.latitude;
        let el_lg = el.longitude;
        let la_dist, lg_dist;

        (el_la >= 0 && la < 0) ?
          la_dist = (Math.round(Math.abs(el_la + Math.abs(la)) * 100) / 100) :
          la_dist = (Math.round(Math.abs(el_la - la) * 100) / 100);

        (el_lg >= 0 && lg < 0) ?
          lg_dist = (Math.round(Math.abs(el_lg + Math.abs(lg)) * 100) / 100) :
          lg_dist = (Math.round(Math.abs(el_lg - lg) * 100) / 100);

        el.distance = (Math.round((la_dist + lg_dist) * 100) / 100);
      });

    let closest_city = this.string
      .reduce(
        (previous, current) =>
          previous.distance < current.distance ?
            previous : current
      ).city;

    return `The most closest city to entered coordinates is ${closest_city}`;
  }
}

const a = new CityMap({
  string: '"Nashville, TN", 36.17, -86.78; "New York, NY", 40.71, -74.00; "Atlanta, GA", 33.75, -84.39; "Denver, CO", 39.74, -104.98; "Seattle, WA", 47.61, -122.33; "Los Angeles, CA", 34.05, -118.24; "Memphis, TN", 35.15, -90.05;'
});

const b = new CityMap({
  string: '"Москва, МО", 66.17, 86.78; "Минск, Минск", 60.71, 84.00; '
});

console.log(a.string);

console.log(a.northernmost);
console.log(a.southernmost);
console.log(a.westernmost);
console.log(a.easternmost);

console.log(a.closestCity(35.05, -104.39));
console.log(a.closestCity(35.05, -84.39));
console.log(a.closestCity(-85.05, -134.39));

console.log(a.states);

console.log(a.citiesInState('TN'));
console.log(a.citiesInState('CA'));


