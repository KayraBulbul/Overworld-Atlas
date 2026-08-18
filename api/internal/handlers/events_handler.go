package handlers

import (
	"log/slog"
	"math"
	"net/http"
	"strconv"
	"time"

	database "github.com/KayraBulbul/Overworld-Atlas/api/internal/database/generated"
	"github.com/KayraBulbul/Overworld-Atlas/api/internal/respond"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type EventsHandler struct {
	queries *database.Queries
	logger  *slog.Logger
}

type Event struct {
	OrganiserID pgtype.UUID        `json:"organiser_id"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Slug        string             `json:"slug"`
	StartDate   pgtype.Timestamptz `json:"start_date"`
	EndData     pgtype.Timestamptz `json:"end_date"`
	IsPublished bool               `json:"is_published"`
	PublishedAt pgtype.Timestamptz `json:"published_at"`
}

func NewEventsHandler(queries *database.Queries, logger *slog.Logger) *EventsHandler {
	return &EventsHandler{
		queries: queries,
		logger:  logger,
	}
}

func (e *EventsHandler) GetEventsPageHandler(w http.ResponseWriter, r *http.Request) {
	now := pgtype.Timestamptz{
		Time:  time.Now(),
		Valid: true,
	}
	pastParams := database.GetPageOfPastEventsParams{
		EndDate: now,
		Limit:   12,
		Offset:  0,
	}
	ongoingParams := database.GetPageOfOngoingEventsParams{
		StartDate: now,
		Limit:     12,
		Offset:    0,
	}
	upcomingParams := database.GetPageOfUpcomingEventsParams{
		StartDate: now,
		Limit:     12,
		Offset:    0,
	}

	query := r.URL.Query()

	if query.Has("page_size") {
		pageSizeStr := query.Get("page_size")

		val, err := strconv.Atoi(pageSizeStr)
		if err != nil {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page_size must be an integer")
			return
		}
		if val < 51 && val > 0 {
			pastParams.Limit = int32(val)
			ongoingParams.Limit = int32(val)
			upcomingParams.Limit = int32(val)
		} else if val > 50 {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page size is too large (must be 50 or less)")
			return
		} else if val < 1 {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page size must be at least 1")
			return
		}
	}

	if query.Has("page") {
		pageNumStr := query.Get("page")

		page, err := strconv.ParseInt(pageNumStr, 10, 64)
		if err != nil {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page must be an integer")
			return
		}
		if page > 0 {
			if (page - 1) > int64(math.MaxInt32)/int64(pastParams.Limit) {
				respond.WithError(w, http.StatusBadRequest, "validation_error", "page is too large")
				return
			}

			offset := int32((page - 1)) * pastParams.Limit

			pastParams.Offset = offset
			ongoingParams.Offset = offset
			upcomingParams.Offset = offset
		} else {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page must be at least 1")
			return
		}
	}

	dbPastEvents, err := e.queries.GetPageOfPastEvents(r.Context(), pastParams)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting past events page")
		e.logger.Error("error getting past events page from database", "error", err)
		return
	}
	dbOngoingEvents, err := e.queries.GetPageOfOngoingEvents(r.Context(), ongoingParams)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting ongoing events page")
		e.logger.Error("error getting ongoing events page from database", "error", err)
		return
	}
	dbUpcomingEvents, err := e.queries.GetPageOfUpcomingEvents(r.Context(), upcomingParams)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting upcoming events page")
		e.logger.Error("error getting upcoming events page from database", "error", err)
		return
	}

	pastEvents := []Event{}
	ongoingEvents := []Event{}
	upcomingEvents := []Event{}

	for _, pastEvent := range dbPastEvents {
		pastEvents = append(pastEvents, Event{
			OrganiserID: pastEvent.OrganiserID,
			Title:       pastEvent.Title,
			Description: pastEvent.Description,
			Slug:        pastEvent.Slug,
			StartDate:   pastEvent.StartDate,
			EndData:     pastEvent.EndDate,
			IsPublished: pastEvent.IsPublished,
			PublishedAt: pastEvent.PublishedAt,
		})
	}
	for _, ongoingEvent := range dbOngoingEvents {
		ongoingEvents = append(ongoingEvents, Event{
			OrganiserID: ongoingEvent.OrganiserID,
			Title:       ongoingEvent.Title,
			Description: ongoingEvent.Description,
			Slug:        ongoingEvent.Slug,
			StartDate:   ongoingEvent.StartDate,
			EndData:     ongoingEvent.EndDate,
			IsPublished: ongoingEvent.IsPublished,
			PublishedAt: ongoingEvent.PublishedAt,
		})
	}
	for _, upcomingEvent := range dbUpcomingEvents {
		upcomingEvents = append(upcomingEvents, Event{
			OrganiserID: upcomingEvent.OrganiserID,
			Title:       upcomingEvent.Title,
			Description: upcomingEvent.Description,
			Slug:        upcomingEvent.Slug,
			StartDate:   upcomingEvent.StartDate,
			EndData:     upcomingEvent.EndDate,
			IsPublished: upcomingEvent.IsPublished,
			PublishedAt: upcomingEvent.PublishedAt,
		})
	}

	pastCount, err := e.queries.GetPastCount(r.Context(), now)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting past event count")
		e.logger.Error("error getting past event count", "error", err)
		return
	}
	ongoingCount, err := e.queries.GetOngoingCount(r.Context(), now)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting ongoing event count")
		e.logger.Error("error getting ongoing event count", "error", err)
		return
	}
	upcomingCount, err := e.queries.GetUpcomingCount(r.Context(), now)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting upcoming event count")
		e.logger.Error("error getting upcoming event count", "error", err)
		return
	}

	totalItems := pastCount + ongoingCount + upcomingCount

	type response struct {
		PastEvents     []Event `json:"past_events"`
		OngoingEvents  []Event `json:"ongoing_events"`
		UpcomingEvents []Event `json:"upcoming_events"`
		TotalItems     uint32  `json:"total_items"`
	}

	respond.WithJSON(w, http.StatusOK, response{
		PastEvents:     pastEvents,
		OngoingEvents:  ongoingEvents,
		UpcomingEvents: upcomingEvents,
		TotalItems:     uint32(totalItems),
	})
}

func (e *EventsHandler) GetEventBySlugHandler(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	event, err := e.queries.GetEventBySlug(r.Context(), slug)
	if err == pgx.ErrNoRows {
		respond.WithError(w, http.StatusNotFound, "event_not_found", "event not found")
		return
	} else if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting event from database")
		e.logger.Error("error getting event from database", "error", err)
		return
	}

	respond.WithJSON(w, http.StatusOK, Event{
		OrganiserID: event.OrganiserID,
		Title:       event.Title,
		Description: event.Description,
		StartDate:   event.StartDate,
		EndData:     event.EndDate,
		IsPublished: event.IsPublished,
		PublishedAt: event.PublishedAt,
	})
}
