using Data.Models;
using Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MyAPI.DTO;
using MyAPI.Services;
using System.Net;

namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly EventsService _eventsService;
        private readonly IMemoryCache _memoryCache;

        public EventsController(EventsService eventsService, IMemoryCache memoryCache)
        {
            _eventsService = eventsService;
            _memoryCache = memoryCache;
        }

        [Route("{eventId}")]
        [HttpGet]
        public ActionResult<Event> GetEventById(int eventId)
        {
            Event myEvent = _eventsService.GetByIdRequest(eventId);
            return Ok(myEvent);
        }

        [Route("{eventId}/registration")]
        [HttpGet]
        public ActionResult<List<User>> GetEventUsers(int eventId)
        {
            List<User> eventUsers = _eventsService.GetEventUsersRequest(eventId);
            return Ok(eventUsers);
        }

        [Route("schedule")]
        [HttpGet]
        public ActionResult<List<Event>> GetSchedule(DateTime startDate, DateTime endDate)
        {
            List<Event> myEvents = _eventsService.GetScheduleRequest(startDate, endDate);
            return Ok(myEvents);
        }

        [Route("")]
        [HttpPost]
        public ActionResult<Event> CreateEvent([FromBody] Event newEvent)
        {
            _eventsService.CreateRequest(newEvent);
            return Ok(newEvent);
        }

        [Route("{eventId}/registration")]
        [HttpPost]
        public ActionResult RegisterToEvent(int eventId, [FromBody] User user)
        {
            if (_eventsService.RegisterRequest(eventId, user) == false) return NotFound();
            return Ok();
        }

        [Route("{eventId}")]
        [HttpPut]
        public ActionResult UpdateEvent(int eventId, [FromBody] Event changedEvent)
        {
            if(_eventsService.UpdateRequest(eventId, changedEvent) == null) return NotFound();
            return Ok();
        }

        [Route("{eventId}")]
        [HttpDelete]
        public ActionResult DeleteEvent(int eventId)
        {
            if(_eventsService.DeleteRequest(eventId) == false) return NotFound();
            return Ok();
        }

        [Route("{eventId}/weather")]
        [HttpGet]
        public ActionResult<WeatherDTO> GetWeather(int eventId)
        {
            Event myEvent = _eventsService.GetByIdRequest(eventId);
            if (myEvent == null) return NotFound();

            WeatherDTO cacheWeather = _memoryCache.Get<WeatherDTO>("weather-cache");
            string cacheLocation = _memoryCache.Get<string>("location");
            if (cacheWeather != null && cacheLocation == myEvent.Location) return Ok(cacheWeather);

            WeatherDTO weather = _eventsService.RequestWeather(eventId);
            // Set the data in the cache
            var expirationTime = DateTimeOffset.Now.AddSeconds(15);
            _memoryCache.Set("weather-cache", weather, expirationTime);
            _memoryCache.Set("location", myEvent.Location, expirationTime);
            return Ok(weather);
        }
    }
}
