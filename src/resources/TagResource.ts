import {AxiosResponse} from 'axios';
import axios from 'src/libs/axios';

export interface TagsResponse {
  page: number;
  has_additional: boolean;
  tags: Tag[];
}

export interface Tag {
  name: string;
  is_manifest_list: boolean;
  last_modified: string;
  manifest_digest: string;
  reversion: boolean;
  size: number;
  start_ts: number;
  manifest_list: ManifestList;
}

export interface ManifestList {
  schemaVersion: number;
  mediaType: string;
  manifests: Manifest[];
}
export interface Manifest {
  mediaType: string;
  size: number;
  digest: string;
  platform: Platform;
  security: SecurityDetailsResponse;
}
export interface Platform {
  architecture: string;
  os: string;
  features: string[];
}

export interface ManifestByDigestResponse {
  digest: string;
  is_manifest_list: boolean;
  manifest_data: string;
  config_media_type?: any;
  layers?: any;
}

export interface SecurityDetailsResponse {
  status: string;
  data: Data;
}
export interface Data {
  Layer: Layer;
}
export interface Layer {
  Name: string;
  ParentName: string;
  NamespaceName: string;
  IndexedByVersion: number;
  Features: Feature[];
}
export interface Feature {
  Name: string;
  VersionFormat: string;
  NamespaceName: string;
  AddedBy: string;
  Version: string;
  Vulnerabilities: any[];
}

export async function getTags(
  org: string,
  repo: string,
  page: number,
  limit = 100,
) {
  try {
    const response: AxiosResponse<TagsResponse> = await axios.get(
      `/api/v1/repository/${org}/${repo}/tag/?limit=${limit}&page=${page}&onlyActiveTags=true`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`API error getting tags ${error.message}`);
  }
}

export async function getManifestByDigest(
  org: string,
  repo: string,
  digest: string,
) {
  try {
    const response: AxiosResponse<ManifestByDigestResponse> = await axios.get(
      `/api/v1/repository/${org}/${repo}/manifest/${digest}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`API error getting manifest by digest ${error.message}`);
  }
}

export async function getSecurityDetails(
  org: string,
  repo: string,
  digest: string,
) {
  try {
    const response: AxiosResponse<SecurityDetailsResponse> = await axios.get(
      `/api/v1/repository/${org}/${repo}/manifest/${digest}/security?vulnerabilities=true`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`API error getting security details ${error.message}`);
  }
}
