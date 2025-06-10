using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class EventsRepository
    {
        EventsContext db = new EventsContext();
        public EventsRepository(EventsContext db)
        {
            this.db = db;
        }

        public Event GetById(int eventId)
        {
            Event myEvent = db.Events.FirstOrDefault(e => e.Id == eventId);
            return myEvent;
        }

        public List<User> GetEventUsers(int eventId)
        {
            Event myEvent = db.Events.Include(e => e.EventUsers).ThenInclude(eu => eu.UserRefNavigation).FirstOrDefault(e => e.Id == eventId);
            if (myEvent == null) return null;
            return myEvent.EventUsers.Select(u => new User { Id = u.UserRefNavigation.Id, Name = u.UserRefNavigation.Name, DateOfBirth = u.UserRefNavigation.DateOfBirth}).ToList();
        }

        public List<Event> FetchScheduleRequest(DateTime startDate, DateTime endDate)
        {
            List<Event> myEvents = db.Events.Where(e => (e.StartDate <= startDate && endDate >= startDate ) || (e.StartDate >= startDate && e.StartDate <= endDate)).ToList();
            return myEvents;
        }

        public void Create(Event newEvent)
        {
            db.Add(newEvent);
            db.SaveChanges();
        }

        public bool Register(int eventId, User user)
        {
            // Finding the event
            Event myEvent = db.Events.FirstOrDefault(e => e.Id == eventId);
            if (myEvent == null) return false;

            // Adding the user to the User table
            db.Users.Add(user);

            db.SaveChanges();

            // Creating a new user/event connection
            EventUser eventUser = new EventUser();
            eventUser.EventRef = eventId;
            eventUser.UserRef = user.Id;
            eventUser.Creation = DateTime.Now;
            db.EventUsers.Add(eventUser);

            db.SaveChanges();

            return true;
        }

        public bool UpdateEventRepo(int eventId, Event changedEvent)
        {
            Event myEvent = db.Events.FirstOrDefault(e => e.Id == eventId);
            if (myEvent == null) return false;

            myEvent.Name = changedEvent.Name;
            myEvent.StartDate = changedEvent.StartDate;
            myEvent.EndDate = changedEvent.EndDate;
            myEvent.MaxRegistrations = changedEvent.MaxRegistrations;
            myEvent.Location = changedEvent.Location;
            db.SaveChanges();

            return true;
        }

        public bool DeleteEventRepo(int eventId)
        {
            Event myEvent = db.Events.Include(e => e.EventUsers).ThenInclude(eu => eu.UserRefNavigation).FirstOrDefault(e => e.Id == eventId);
            List<EventUser> eventUsers = myEvent.EventUsers.ToList();
            if (myEvent == null) return false;

            foreach (EventUser eventUser in eventUsers)
            {
                db.EventUsers.Remove(eventUser);
                db.Users.Remove(eventUser.UserRefNavigation);
            }

            db.Events.Remove(myEvent);
            db.SaveChanges();

            return true;
        }
    }
}
