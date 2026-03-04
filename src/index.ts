import axios from "axios";
import {
  Data,
  Feed,
  FeedPayload,
  FeedResponseOnCreate,
  QueryFilter,
} from "casafari";

export default ({ token, baseUrl }: { token: string; baseUrl: string }) => {
  const config = { headers: { Authorization: token } };

  const setToken = (token: string) => {
    config.headers.Authorization = token;
  };

  const getFeeds = async () =>
    (await axios.get<Feed[]>(`${baseUrl}/v1/feeds`, config)).data;

  const createFeed = async (body: FeedPayload) =>
    (
      await axios.post<FeedResponseOnCreate>(
        `${baseUrl}/v1/feeds`,
        body,
        config,
      )
    ).data;

  const deleteFeed = async (id: number) =>
    (
      await axios.delete<{ success: boolean }>(
        `${baseUrl}/v1/feeds/${id}`,
        config,
      )
    ).data;

  const getFeed = async (id: number, params?: Partial<QueryFilter>) =>
    (
      await axios.get<Data>(`${baseUrl}/v1/feeds/${id}`, {
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
