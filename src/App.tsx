import { useEffect, useRef, useState } from "react";
import Globe, { GlobeInstance } from "globe.gl";
import { COUNTRY_NOTES } from "./data/country-notes";
import "./App.css";

// GeoJSONの1ポリゴン（国）の型定義を明示的に行う
// 地球儀上の情報
type GeoFeature = {
  properties: Record<string, unknown>;
  id: string;
};

// REST Countries APIのレスポンスの型を明記
// version 5に合わせて更新
// 国情報まとめAPIからの情報
type CountryInfo = {
  names: {
    common: string;
    official: string;
    native: {
      zho: { common: string; official: string };
    };
  };
  codes: { alpha_3: string }; // （表示用）REST Countries API側のID
  capitals: [{ name: string | undefined }]; // 国の首都の名前（undefinedになる国もある、南極など）
  flag: { url_svg: string | undefined }; // 国旗のSVG画像のURL（ロシアが表示されないのでダミー画像が必要）
  region: string;
  subregion: string; // 地域（東アジアなど）
  population: number; // 人口
  languages: [{ name: string; native_name: string }]; // 0:第一言語、1?:第二言語
  tlds: string[]; // 国のトップレベルドメイン（.jp、.usなど）の配列（0:jp、1:現地名）
  calling_codes: string[]; // 電話番号
  cars: { driving_side: string; signs: string[] }; // 通行車線
  currencies: [{ code: string; name: string; symbol: string }]; // 通貨（コード、名前、記号＄など）
};

// 定数
const POLYGON_STYLE = {
  // 通常の国の色
  defaultCapColor: "rgba(0, 200, 255, 0.1)",
  // 通常の国の側面の色
  defaultSideColor: "rgba(0, 200, 255, 0.15)",
  // 通常の国の枠線の色
  defaultStrokeColor: "#00c8ff",
  // 選択中の国の色
  selectedCapColor: "rgba(255, 30, 150, 0.3)",
  // 選択中の国の側面色
  selectedSideColor: "rgba(255, 30, 150, 0.3)",
  // 選択中の国の側面色
  selectedStrokeColor: "rgba(255, 30, 150, 0.8)",
  // ホバー中の国の色
  hoveredCapColor: "rgba(0, 200, 255, 0.5)",
  // 通常の国の高さ
  defaultAltitude: 0.015,
  // 選択中の国の高さ
  selectedAltitude: 0.05,
} as const;

// ---------------------------------------------------------------------------------型定義等は再レンダリングの必要がないので外へ

function App() {
  // 地球儀を描く場所（div）への参照を作ってる（再レンダリングされない変数管理？）
  const containerRef = useRef<HTMLDivElement>(null);

  // 地球儀のインスタンスをuseRefで管理
  const globeRef = useRef<GlobeInstance | null>(null);

  // クリックした国の情報を管理するstate
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(
    null,
  );

  // パネル開閉State
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // 選択した国のGEOJson側のID
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);

  // -------------------------------------------------------------------------------useEffect等

  useEffect(() => {
    // null チェック：current が null なら何もしない（early return）
    if (!containerRef.current) return;

    // globeを初期化する
    // GeoJSONのデータを地球儀化するglobe.glライブラリ
    const globe = new Globe(containerRef.current)
      // テクスチャ画像を設定
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      )
      // 背景画像を設定
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      // 表示サイズを設定（表示領域調整できそう）
      .width(window.innerWidth)
      .height(window.innerHeight);

    // ウィンドウサイズ変更時の処理
    const handleResize = () => {
      globe.width(window.innerWidth).height(window.innerHeight);
    };

    // 国のGeoJSONデータを取得して地球儀に反映
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((res) => res.json())
      .then((data) => {
        // 地球儀にポリゴンレイヤーを追加していく
        globe
          // GeoJSONデータを設定
          // data.featuresは国の情報が入った配列で、これをもとに立体円錐を作成するプロパティ
          .polygonsData(data.features)

          // ------------------------------------------------------これ以降は国に一つ一つ（data.features[n]）ごとに適応される処理の定義

          // ポリゴンの表面の色を設定
          .polygonCapColor(() => POLYGON_STYLE.defaultCapColor)
          // ポリゴンの側面の色を設定
          .polygonSideColor(() => POLYGON_STYLE.defaultSideColor)
          // ポリゴンの枠線の色を設定
          .polygonStrokeColor(() => POLYGON_STYLE.defaultStrokeColor)
          // ポリゴンの高さを少し上げる
          .polygonAltitude(() => POLYGON_STYLE.defaultAltitude)
          // ポリゴンのラベル表示
          .polygonLabel((polygon) => {
            // 整理してから渡したほうがすっきりする
            const feature = polygon as GeoFeature;
            const geoId = feature.id;
            const geoName = feature.properties.name as string | undefined;
            const countryNote = COUNTRY_NOTES[geoId];
            console.log(polygon);

            return `<b>
                    ${geoName ?? "NONE"}（${geoId ?? "---"}）</b>
                    <div>${countryNote?.jaName ?? "なし"}</div>`;
          })

          // ポリゴンのクリックイベントを設定（クリックした国がpolygonに入り実行される処理を定義）
          // ------------------------------------------------------クリックしたときはこれ以下の処理が実行される
          .onPolygonClick((polygon) => {
            // polygon は globe.gl 内部では object 型 → GeoFeature として扱うと伝える
            const feature = polygon as GeoFeature;

            // なぜかunknown型をstringへ
            // const countryName = feature.properties.name as string;
            console.log("clicked", feature, feature.id);

            // IDだけを先にStateに保存
            setSelectedGeoId(feature.id);

            // クリックした情報を確認して色を変える
            console.log("polygon", polygon);
            globe
              .polygonCapColor((d) =>
                d === polygon
                  ? POLYGON_STYLE.selectedCapColor
                  : POLYGON_STYLE.defaultCapColor,
              )
              .polygonSideColor((d) =>
                d === polygon
                  ? POLYGON_STYLE.selectedSideColor
                  : POLYGON_STYLE.defaultSideColor,
              )
              .polygonStrokeColor((d) =>
                d === polygon
                  ? POLYGON_STYLE.selectedStrokeColor
                  : POLYGON_STYLE.defaultStrokeColor,
              )
              .polygonAltitude((d) =>
                d === polygon
                  ? POLYGON_STYLE.selectedAltitude
                  : POLYGON_STYLE.defaultAltitude,
              );

            // REST Countries APIから国情報を取得する関数を定義
            const getCountryInfo = async () => {
              try {
                console.log("search_code", feature.id);
                const res = await fetch(
                  // 「プロパティ/値」でそのプロパティの完全一致したデータを取得できる
                  `https://api.restcountries.com/countries/v5/codes.alpha_3/${feature.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${import.meta.env.VITE_REST_COUNTRIES_API_KEY}`,
                    },
                  },
                );
                const responseData = await res.json();
                const countryData = responseData.data.objects[0];
                setSelectedCountry(countryData as CountryInfo);

                // console.log("responseData", responseData);

                console.log("data", countryData);
                // console.log("eng_name", countryData.demonyms.eng.f);
                // console.log("capital", countryData.capitals[0].name);
                // console.log("image", countryData.flag.url_svg);
              } catch (error) {
                console.error("error: ", error);
              }
            };

            // 国情報を取得してstateに保存する関数を呼び出す
            getCountryInfo();

            // console.log("log", data);
            // console.log(feature.properties);
            // console.log("id: ", feature.id);
          });
      });

    // ウィンドウサイズ変更時のイベントリスナーを追加
    window.addEventListener("resize", handleResize);

    // 設定したglobeをglobeRefにセット
    globeRef.current = globe;

    // クリーンアップ関数：コンポーネントがアンマウントされるとき（ページ離脱とか？）に実行される
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --------------------------------------------------------selectedCountryCodeに応じてホバーする処理だけ別のuseEffect
  useEffect(() => {
    const globe = globeRef.current;
    // ポリゴンのホバーイベントを設定（ホバーした国がpolygonに入り実行される処理を定義）
    if (!globe) {
      return;
    }
    // ------------------------------------------------------ホバーしたときはこれ以下の処理が実行される
    globe.onPolygonHover((polygon) => {
      // 各国において色を変える処理を上書き定義
      // // {} を使うと複数行の関数を書ける。（アロー関数で書いた無名のコールバック関数）その場合は return で色を返す必要がある
      globe.polygonCapColor((d) => {
        const feature = d as GeoFeature;
        return (feature.id as string) === selectedGeoId
          ? POLYGON_STYLE.selectedCapColor
          : d === polygon
            ? POLYGON_STYLE.hoveredCapColor
            : POLYGON_STYLE.defaultCapColor;
      });
    });
  }, [selectedGeoId]);

  return (
    <>
      {/* <div>hello</div> */}
      <div ref={containerRef} id="globe-container"></div>

      {
        // 中身があれば選択した国の情報を表示する
        // color:bg(background)-blue(青系)/50(不透明度)
        // sm未満では左右端を等間隔に開けて配置、sm以上は右上に80, lg以上は25vw（画面25%）の幅で配置
        selectedCountry && selectedGeoId && (
          <div className="bg-gray-950/80 text-white border-3 border-cyan-600/70 rounded-lg absolute top-5 right-5 left-5 sm:left-auto sm:w-80 xl:w-[25vw] 2xl:w-[30vw] 2xl:min-h-[20vh] 2xl:max-h-[90vh] 2xl:text-xl">
            {/* なければundefinedになる */}
            <div className="p-4">
              <div className="flex flex-row">
                <div className="basis-2/3">
                  <div className="text-[calc(2rem)] font-bold">
                    {COUNTRY_NOTES[selectedGeoId]?.jaName ?? "---"}
                  </div>
                  <div>{selectedCountry?.names?.common}</div>
                  <div>首都：{selectedCountry?.capitals[0]?.name ?? "---"}</div>
                  <div>地域：{selectedCountry?.subregion ?? "---"}</div>
                  <div>ID：{selectedGeoId ?? "---"}</div>
                  <div>TLD：{selectedCountry?.tlds[0] ?? "---"}</div>
                </div>
                <div className="basis-1/3 flex items-center">
                  <img
                    className="object-contain h-4/5 w-full"
                    src={selectedCountry?.flag?.url_svg ?? ""}
                    alt="国旗"
                    onClick={() => {
                      setIsPanelExpanded(!isPanelExpanded);
                    }}
                  />
                </div>
              </div>
              {isPanelExpanded && (
                <div>
                  <div>
                    <div className="border-b-3 border-cyan-600/70">
                      <br />
                    </div>
                    <br />
                  </div>
                  <div className="max-h-[20vh] sm:max-h-[40vh] overflow-y-auto">
                    <div>
                      人口：{selectedCountry?.population.toString() ?? "なし"}{" "}
                      人
                    </div>
                    <div>
                      市外局番：{selectedCountry?.calling_codes[0] ?? "なし"}
                    </div>
                    <div>
                      通行車線：{selectedCountry?.cars?.driving_side ?? "なし"}
                    </div>
                    <div>
                      車の国コード：{selectedCountry?.cars?.signs[0] ?? "なし"}
                    </div>
                    <div>
                      通貨：
                      {`${selectedCountry?.currencies[0]?.name ?? "なし"}, ${selectedCountry?.currencies[0]?.code ?? "なし"}, 100${selectedCountry?.currencies[0]?.symbol ?? "なし"}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }
    </>
  );
}

export default App;
