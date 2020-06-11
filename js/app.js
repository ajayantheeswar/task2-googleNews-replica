const Sidebar = document.querySelector('.side-bar');
const Sidebar_button = document.querySelector('.burger-button');
const backdrop = document.querySelector('#backdrop');
const news_feeds = document.querySelector('.news-feeds');
const spinner = document.querySelector('#loading-spinner');
const template = document.querySelector('.weather-content');

const API_URL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=HSbAQKt35M3GsTemo0QRgSU7xSPfYlRD`;

const create_newsElement = (news_data) => {
    const new_news = document.createElement('div');
    new_news.className = 'news-feed';
    new_news.dataset.call_to_action = news_data.url;
    new_news.innerHTML = `
    <span class="source">
        <img class="news-feed--icon" src="assets/news.svg" />
        <span>${news_data.section}</span>
    </span>
    <h2 class="head-lines">${news_data.title}</h2>
    <img class="thumbnail" src="${news_data.multimedia[1].url}">
    <p class="content">${news_data.abstract}</p>
    `;
    news_feeds.appendChild(new_news);
}

const get_weather_item = (day,url,min,max) => `
    <h5>${day}</h5>
    <img src="${url}" />
    <p id='day-min'>${min.toFixed(0) + '°C'}</p>
    <p>${max.toFixed(0) + '°C'}</p>
`;

const getDay = (day) => {
    switch(day){
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
    }
}

const load_cloud_html = (data)=>{
    
    console.log(data);
    template.querySelector('#cur-loc').innerHTML = data.timezone;
    template.querySelector('#cur-con').innerHTML = data.current.weather[0].description;
    template.querySelector('#cur-temp').innerHTML = data.current.temp + '°C';
    template.querySelector('#cur-icon').src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    
    const future_weather = template.querySelector('.future-weathers-container');

    for(let i=0 ; i<5 ;i++){
        const ele = document.createElement('div');
        ele.className = 'future-weather-item';
        let day;
        day = 'Today';
        if(i != 0){
            new Date()
            DailyDate = new Date(+(data.daily[i].dt + '000'));
            day = getDay(+DailyDate.getDay());
        }
        
        let url = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        let min = data.daily[i].temp.min;
        let max = data.daily[i].temp.max;

         ele.innerHTML = get_weather_item(day,url,min,max);
         future_weather.appendChild(ele);
    }
    
}


const Load_weather  = (lat,lon) =>{
    const weather_api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}&units=metric&appid=948c002b5b449c3e3b34d30949ee4ce6`;
    const interval = setTimeout(() => {
        axios.get(weather_api)
            .then(response => {
                load_cloud_html(response.data);
                template.classList.add('show');
                
            })
            .catch(error =>{
                console.log(error);
            })        
    }, 2000);

}

backdrop.addEventListener('click',(event) => {
    
    close();
});

Sidebar_button.addEventListener('click',(event) => {
    
    if(Sidebar.classList.contains('show')){
        close();
    }else{
        news_feeds.classList.add('show');
        Sidebar.classList.add('show');
        backdrop.classList.add('show');
    }
    
});

const close = () => {
    Sidebar.classList.remove('show');
    backdrop.classList.remove('show');
    news_feeds.classList.remove('show');
}



news_feeds.addEventListener('click', (event) => {
    const url = event.target.closest('.news-feed').dataset.call_to_action;
    if (url){
        window.location.href  = url;
    }
});

axios.get(API_URL)
    .then(response =>{
        const news = response.data;
        console.log(news);
        if (news && news.status === 'OK'){
            for (let each_news of news.results){
                create_newsElement(each_news);
            }
            spinner.classList.add('stop');
        }
    })
    .catch(error => {
        console.log(error);
    });

navigator.geolocation.getCurrentPosition(location =>{
        console.log(location);
        const lat = location.coords.latitude || 11.127;
        const lon = location.coords.longitude || 78.657;
        Load_weather(lat,lon);
    }, error =>{
        console.log(error);
    });







