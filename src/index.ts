import axios from "axios";
import {
  Feed,
  FeedPayload,
  FeedResponseOnCreate,
  QueryFilter,
  Data,
} from "casafari";

export type InternFeedEnvironment = {
  environment: "development" | "production" | "stage";
};
export type ContactsInfo = {
  name: string | undefined;
  email: string | undefined;
  phone: string;
};

export type FeedCount = {
  id: string;
  name: string;
  count: number;
};

export type FeedResult = Omit<
  Data["results"][0],
  "location" | "coordinates" | "alert_date_and_time"
> & {
  _id: string;
  location: { location_id: number; name: string };
  coordinates: { type: "Point"; coordinates: [number, number] };
  alert_date_and_time: string;
  createdAt: string;
  updatedAt: string;
};

export type FeedResults = {
  id: string;
  name: string;
  filter: {
    operation: string;
    types: string[];
    custom_locations: Array<Array<unknown>>;
    statuses: string[];
    with_agencies: string[];
    without_agencies: string[];
  };
  next: string | null;
  previous: string | null;
  results: FeedResult[];
};

export default ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  const config = { headers: { Authorization: token } };

  const setToken = (token: string) => {
    config.headers.Authorization = token;
  };

  const getFeeds = async () =>
    (
      await axios.get<(Feed & InternFeedEnvironment)[]>(
        `${baseUrl}/v1/feeds`,
        config,
      )
    ).data;

  const createFeed = async (body: FeedPayload & InternFeedEnvironment) =>
    (
      await axios.post<FeedResponseOnCreate & { _id: string }>(
        `${baseUrl}/v1/feeds`,
        body,
        config,
      )
    ).data;

  const deleteFeed = async (id: string) =>
    (
      await axios.delete<{ success: boolean }>(
        `${baseUrl}/v1/feeds/${id}`,
        config,
      )
    ).data;

  const getFeedCount = async (id: string) =>
    (await axios.get<FeedCount>(`${baseUrl}/v1/feeds/${id}/count`, config))
      .data;

  const getFeedResults = async (id: string, params?: Partial<QueryFilter>) =>
    (
      await axios.get<FeedResults>(`${baseUrl}/v1/feeds/${id}/results`, {
        ...config,
        params,
      })
    ).data;

  return {
    getFeedCount,
    getFeedResults,
    deleteFeed,
    createFeed,
    getFeeds,
    setToken,
  };
};
