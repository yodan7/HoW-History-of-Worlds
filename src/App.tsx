import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import "./App.css";

// GeoJSONの1ポリゴン（国）の型定義を明示的に行う
type GeoFeature = {
  properties: Record<string, unknown>;
  id: string;
};

// REST Countries APIのレスポンスの型を明記
type CountryInfo = {
  name: { common: string; official: string };
  capital: string[];
  flags: { svg: string; png: string };
  region: string;
  subregion: string;
  population: number;
  languages: Record<string, string>;
  tld: string[];
};

function App() {
  // 地球儀を描く場所（div）への参照を作ってる（再レンダリングされない変数管理？）
  const containerRef = useRef<HTMLDivElement>(null);

  // クリックした国の情報を管理するstate
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(
    null,
  );

  useEffect(() => {
    // null チェック：current が null なら何もしない（early return）
    if (!containerRef.current) return;

    // globeを初期化する
    const globe = new Globe(containerRef.current)
      // テクスチャ画像を設定
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      )
      // 背景画像を設定
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      // 表示サイズを設定
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
          // ポリゴンの表面の色を設定
          .polygonCapColor(() => "rgba(0, 200, 255, 0.1)")
          // ポリゴンの側面の色を設定
          .polygonSideColor(() => "rgba(0, 200, 255, 0.15)")
          // ポリゴンの枠線の色を設定
          .polygonStrokeColor(() => "#00c8ff")
          // ポリゴンのクリックイベントを設定
          .onPolygonClick((polygon) => {
            // polygon は globe.gl 内部では object 型 → GeoFeature として扱うと伝える
            const feature = polygon as GeoFeature;

            // なぜかunknown型をstringへ
            const countryname = feature.properties.name as string;

            // REST Countries APIから国情報を取得する関数を定義
            const getCountryInfo = async () => {
              try {
                const res = await fetch(
                  `https://restcountries.com/v3.1/name/${encodeURIComponent(countryname)}?fullText=true`,
                );
                const data = await res.json();
                setSelectedCountry(data[0]);
                console.log(data);
                console.log(data[0].capital);
                console.log(selectedCountry?.capital[0]);
              } catch (error) {
                console.error("error: ", error);
              }
            };

            // 国情報を取得してstateに保存する関数を呼び出す
            getCountryInfo();

            console.log(feature.properties);
            console.log("id: ", feature.id);
          });
      });

    // ウィンドウサイズ変更時のイベントリスナーを追加
    window.addEventListener("resize", handleResize);

    // クリーンアップ関数：コンポーネントがアンマウントされるとき（ページ離脱とか？）に実行される
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} id="globe-container"></div>

      {
        // 中身があれば選択した国の情報を表示する
        // color:bg(background)-blue(青系)/50(不透明度)
        selectedCountry && (
          <div className="bg-gray-950/80 text-white border-3 border-cyan-600/70 rounded-lg p-4 absolute top-5 right-5">
            {/* なければundefinedになる */}
            <div className="flex flex-row">
              <div className="basis-2/3">
                <div className="">{selectedCountry?.name.common}</div>
                <div>国の首都：{selectedCountry?.capital?.[0] ?? "なし"}</div>
              </div>
              <div className="basis-1/3">
                <img
                  className="object-contain h-20 w-30"
                  src={selectedCountry?.flags?.svg ?? ""}
                  alt="国旗"
                />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default App;
