import {getNavigationEntry} from "../utils/getNavigationEntry";

/**
 * 获取 L（onLoad）
 * 当依赖的资源全部加载完毕之后才会触发
 */
export const getL = () => {
    const navigation = getNavigationEntry();
    setTimeout(() => {
        console.log('L', navigation.loadEventEnd - navigation.startTime);
    }, 100);

}