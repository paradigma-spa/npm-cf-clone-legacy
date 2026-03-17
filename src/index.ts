import axios from "axios";
import {
  Data,
  Feed,
  FeedPayload,
  FeedResponseOnCreate,
  QueryFilter,
} from "casafari";

export type InternFeedEnvironment = {
  enviroment: "development" | "production" | "stage";
};

export type DataWithId = {
  count: Data["count"];
  next: Data["next"];
  previous: Data["previous"];
  results: (Data["results"][0] & { _id: string })[];
};

export default ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  const config = { headers: { Authorization: token } };

  const setToken = (token: string) => {
    config.headers.Authorization = token;
  };

  const getFeeds = async () =>
    (await axios.get<Feed[]>(`${baseUrl}/v1/feeds`, config)).data;

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

  const getFeed = async (id: string, params?: Partial<QueryFilter>) =>
    (
      await axios.get<DataWithId>(`${baseUrl}/v1/feeds/${id}`, {
        ...config,
        params,
      })
    ).data;

  return {
    getFeed,
    deleteFeed,
    createFeed,
    getFeeds,
    setToken,
  };
};
