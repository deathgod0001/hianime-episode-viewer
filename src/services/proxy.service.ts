
import axios from 'axios';

interface ProxyOptions {
  url: string;
  headers?: Record<string, string>;
}

/**
 * Service to proxy m3u8 and other streaming content
 */
export const ProxyService = {
  /**
   * Fetch content through proxy
   */
  fetchContent: async ({ url, headers = {} }: ProxyOptions): Promise<any> => {
    try {
      const response = await axios.get(url, { 
        headers: {
          'Referer': 'https://hianime-up.vercel.app/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      console.error('ProxyService fetchContent error:', error);
      throw error;
    }
  }
};
