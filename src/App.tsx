import { useEffect, useRef } from "react";
import Globe from "globe.gl";
import "./App.css";

//GeoJSONの1ポリゴン（国）の型定義を明示的に行う
type GeoFeature = {
  properties: Record<string, unknown>;
};

function App() {
  //地球儀を描く場所（div）への参照を作ってる（再レンダリングされない変数管理？）
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // null チェック：current が null なら何もしない（early return）
    if (!containerRef.current) return;

    //globeを初期化する
    const globe = new Globe(containerRef.current)
      //テクスチャ画像を設定
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      )
      //背景画像を設定
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      //表示サイズを設定
      .width(window.innerWidth)
      .height(window.innerHeight);

    //ウィンドウサイズ変更時の処理
    const handleResize = () => {
      globe.width(window.innerWidth).height(window.innerHeight);
    };

    //国のGeoJSONデータを取得して地球儀に反映
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((res) => res.json())
      .then((data) => {
        //地球儀にポリゴンレイヤーを追加していく
        globe
          //GeoJSONデータを設定
          //data.featuresは国の情報が入った配列で、これをもとに立体円錐を作成するプロパティ
          .polygonsData(data.features)
          //ポリゴンの表面の色を設定
          .polygonCapColor(() => "rgba(0, 200, 255, 0.1)")
          //ポリゴンの側面の色を設定
          .polygonSideColor(() => "rgba(0, 200, 255, 0.15)")
          //ポリゴンの枠線の色を設定
          .polygonStrokeColor(() => "#00c8ff")
          //ポリゴンのクリックイベントを設定
          .onPolygonClick((polygon) => {
            // polygon は globe.gl 内部では object 型 → GeoFeature として扱うと伝える
            const feature = polygon as GeoFeature;
            console.log(feature.properties);
          });
      });

    //ウィンドウサイズ変更時のイベントリスナーを追加
    window.addEventListener("resize", handleResize);

    //クリーンアップ関数：コンポーネントがアンマウントされるとき（ページ離脱とか？）に実行される
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} id="globe-container"></div>;
}

export default App;
