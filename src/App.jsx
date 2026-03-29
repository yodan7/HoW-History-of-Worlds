import {useEffect, useRef} from 'react';
import Globe from 'globe.gl'
import './App.css'

function App(){
    //地球儀を描く場所（div）への参照を作ってる（再レンダリングされない変数管理？）
    const containerRef = useRef(null);

    useEffect(() => {
        //globeを初期化する
        const globe = Globe()(containerRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(window.innerWidth)
        .height(window.innerHeight);

        //ウィンドウサイズ変更時の処理
        const handleResize = () => {
            globe.width(window.innerWidth).height(window.innerHeight);
        };

        //ウィンドウサイズ変更時のイベントリスナーを追加
        window.addEventListener('resize', handleResize);

        //クリーンアップ関数：コンポーネントがアンマウントされるとき（ページ離脱とか？）に実行される
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return (
        <div ref={containerRef} id="globe-container"></div>
    )

}

export default App;