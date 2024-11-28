import { SupabaseClient } from "@supabase/supabase-js";

// 지원 언어 타입
export enum SupportedLanguage {
  ko = "ko",
  en = "en",
}

// 지원 언어 타입
export enum Location {
  seoul = "Seoul",
  gyeonggi = "Gyeonggi",
  incheon = "Incheon",
  gangwon = "Gangwon",
  chungbuk = "Chungbuk",
  chungnam = "Chungnam",
  busan = "Busan",
  daegu = "Daegu",
  gwangju = "Gwangju",
  daejeon = "Daejeon",
  ulsan = "Ulsan",
  sejong = "Sejong",
  jeonbuk = "Jeonbuk",
  jeonnam = "Jeonnam",
  gyeongbuk = "Gyeongbuk",
  gyeongnam = "Gyeongnam",
  jeju = "Jeju",
}

export enum AddressType {
  naver = "Naver",
  google = "Google",
}

// 라틴바 기본 정보 타입
export interface BarInfo {
  id: string;
  location: Location;
  created_at: string;
  updated_at: string;
}

// 라틴바 전체 정보 타입
export interface BarInfoExt extends BarInfo {
  translations: {
    [key in SupportedLanguage]?: {
      name: string;
      address: string;
      description: string;
    };
  };
  urls: BarUrl[];
}

// 라틴바 주소 타입
export interface BarUrl {
  id: string;
  bar_id: string;
  url_address: string;
  address_type: AddressType;
  is_primary: boolean;
}

// 응답 타입 추가
export interface BarInfoExtResponse {
  data: BarInfoExt | null;
  error: Error | null;
}

export interface BarInfoExtListResponse {
  data: BarInfoExt[];
  error: Error | null;
}

export class ClubInfoExtService {
  private readonly supabase: SupabaseClient;
  private readonly barTableName = "barinfo".toLowerCase();
  private readonly barI18nTableName = "barinfoi18n".toLowerCase();
  private readonly barUrlTableName = "barinfourl".toLowerCase();

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getAllBarsWithTranslations(): Promise<BarInfoExtListResponse> {
    try {
      const { data: barsData, error: barsError } = await this.supabase.from(
        this.barTableName
      ).select(`
          *,
          translations:${this.barI18nTableName}!bar_id(
            id,
            language_code,
            name,
            address,
            description
          ),
          urls:${this.barUrlTableName}!bar_id(
            id,
            url_address,
            address_type,
            is_primary
          )
        `);

      if (barsError) throw barsError;

      const formattedData = barsData.map((bar: any) => {
        const translations: BarInfoExt["translations"] = {};

        bar.translations.forEach((trans: any) => {
          translations[trans.language_code as SupportedLanguage] = {
            name: trans.name,
            address: trans.address,
            description: trans.description,
          };
        });

        return {
          id: bar.id,
          location: bar.location,
          created_at: bar.created_at,
          updated_at: bar.updated_at,
          translations,
          urls: bar.urls,
        };
      });

      return { data: formattedData, error: null };
    } catch (error) {
      console.error("Error fetching bars with translations:", error);
      return { data: [], error: error as Error };
    }
  }
}
