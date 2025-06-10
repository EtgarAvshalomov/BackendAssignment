using Data.Models;
using Data.Repositories;
using Microsoft.Extensions.Logging;
using MyAPI.DTO;
using System.Net;
using System.Text.Json;

namespace MyAPI.Services
{
    public class EventsService
    {
        private readonly EventsRepository _eventsRepository;

        public EventsService(EventsRepository eventsRepository)
        {
            _eventsRepository = eventsRepository;
        }

        public Event GetByIdRequest(int eventId)
        {
            Event myEvent = _eventsRepository.GetById(eventId);
            return myEvent;
        }

        public List<User> GetEventUsersRequest(int eventId)
        {
            List<User> eventUsers = _eventsRepository.GetEventUsers(eventId);
            if (eventUsers == null) return null;
            return eventUsers;
        }

        public List<Event> GetScheduleRequest(DateTime startDate, DateTime endDate)
        {
           List<Event> myEvents = _eventsRepository.FetchScheduleRequest(startDate, endDate);
            return myEvents;
        }

        public WeatherDTO? RequestWeather(int eventId)
        {
            Event myEvent = _eventsRepository.GetById(eventId);
            string city = myEvent.Location;
            string url = $"http://api.weatherstack.com/current?access_key=257d978a8cc2628da8a804ccfc86a395&query={city}";
            string json = (new WebClient()).DownloadString(url);
            using JsonDocument doc = JsonDocument.Parse(json);
            var current = doc.RootElement.GetProperty("current");
            var result = new WeatherDTO
            {
                City = city,
                Temperature = current.GetProperty("temperature").GetInt32(),
                WeatherDescription = current.GetProperty("weather_descriptions")[0].GetString(),
                WindSpeed = current.GetProperty("wind_speed").GetInt32()
            };
            return result;
        }

        public void CreateRequest(Event newEvent)
        {
            _eventsRepository.Create(newEvent);
        }

        public bool RegisterRequest(int eventId, User user)
        {
            if(_eventsRepository.Register(eventId, user) == false) return false;
            return true;
        }

        public bool UpdateRequest(int eventId, Event changedEvent)
        {
           if (_eventsRepository.UpdateEventRepo(eventId, changedEvent) == null) return false;
            return true;
        }

        public bool DeleteRequest(int eventId)
        {
            if(_eventsRepository.DeleteEventRepo(eventId) == false) return false;
            return true;
        }
    }
}
