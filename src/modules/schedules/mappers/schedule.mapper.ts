import { toPublicCompany, type PublicCompany } from '../../companies/mappers/company.mapper.js';
import { Route } from '../../routes/entities/route.entity.js';
import { SeatMap } from '../../seat-maps/entities/seat-map.entity.js';
import { SeatMapType } from '../../seat-maps/enums/seat-map-type.enum.js';
import { Schedule } from '../entities/schedule.entity.js';
import { WeekdayMode } from '../enums/weekday-mode.enum.js';

export type PublicScheduleRoute = {
  id: string;
  route_code: string;
  name: string;
  origin: string;
  destination: string;
};

export type PublicScheduleSeatMap = {
  id: string;
  seat_map_code: string;
  name: string;
  layout_type: SeatMapType;
};

export type PublicSchedule = {
  id: string;
  company_uuid: string;
  company: PublicCompany;
  route_uuid: string;
  route: PublicScheduleRoute;
  seat_map_uuid: string;
  seat_map: PublicScheduleSeatMap;
  start_date: string;
  end_date: string;
  weekday_mode: WeekdayMode;
  weekdays: number[];
  note: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

const ALL_WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];

export function normalizeWeekdayMode(value: unknown) {
  return value === WeekdayMode.Custom ? WeekdayMode.Custom : WeekdayMode.All;
}

export function normalizeWeekdays(mode: WeekdayMode, value: unknown) {
  if (mode === WeekdayMode.All) {
    return [...ALL_WEEKDAYS];
  }

  const list = Array.isArray(value) ? value : [];
  const days = [
    ...new Set(
      list
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 1 && item <= 7),
    ),
  ].sort((left, right) => left - right);

  return days.length ? days : [...ALL_WEEKDAYS];
}

export function toDateOnly(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim().slice(0, 10);
  }

  return '';
}

export function orderedDates(start: unknown, end: unknown) {
  const startDate = toDateOnly(start);
  const endDate = toDateOnly(end);
  if (startDate && endDate && startDate > endDate) {
    return { start_date: endDate, end_date: startDate };
  }
  return { start_date: startDate, end_date: endDate };
}

export function toPublicScheduleRoute(route: Route): PublicScheduleRoute {
  return {
    id: route.uuid,
    route_code: route.route_code,
    name: route.name,
    origin: route.origin,
    destination: route.destination,
  };
}

export function toPublicScheduleSeatMap(seatMap: SeatMap): PublicScheduleSeatMap {
  return {
    id: seatMap.uuid,
    seat_map_code: seatMap.seat_map_code,
    name: seatMap.name,
    layout_type: seatMap.layout_type,
  };
}

export function toPublicSchedule(schedule: Schedule): PublicSchedule {
  const weekdayMode = normalizeWeekdayMode(schedule.weekday_mode);
  return {
    id: schedule.uuid,
    company_uuid: schedule.company.uuid,
    company: toPublicCompany(schedule.company),
    route_uuid: schedule.route.uuid,
    route: toPublicScheduleRoute(schedule.route),
    seat_map_uuid: schedule.seat_map.uuid,
    seat_map: toPublicScheduleSeatMap(schedule.seat_map),
    start_date: toDateOnly(schedule.start_date),
    end_date: toDateOnly(schedule.end_date),
    weekday_mode: weekdayMode,
    weekdays: normalizeWeekdays(weekdayMode, schedule.weekdays),
    note: schedule.note,
    status: schedule.status,
    created_at: schedule.created_at,
    updated_at: schedule.updated_at,
  };
}
