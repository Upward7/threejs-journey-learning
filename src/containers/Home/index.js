import "./index.css"
import React from "react";
import { Box, Grid, styled, Paper } from "@mui/material";
import MediaCard from "../../components/MediaCard";

// styled用于创建具有特定样式的React组件
// Paper用于表示一个具有特定样式的纸片或卡片状元素
// theme.typography包含了Material-UI主题中定义的文本样式，
// body2是其中的一个预设样式，通常用于正文文本。
// Item组件继承body2的所有文本样式属性，如字体大小、行高、字体权重等。
// 根据主题中的间距单位计算实际的间距
// 设置组内文本的颜色，theme.palette包含主题中的颜色板，
// text.secondary是其中的一个预设颜色，通常用于次要文本
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const workList = [
    {
        link: "#/threeText",
        title: "3D Text",
        description: "3D 文字",
        image: require("./images/threeText.png")
    },
    {
        link: "#/particles",
        title: "Particles",
        description: "五颜六色的粒子",
        image: require("./images/particles.png")
    },
    {
        link: "#/galaxy",
        title: "Galaxy",
        description: "银河系",
        image: require("./images/galaxy.png")
    },
    {
        link: "#/scrollBasedAnimation",
        title: "Scroll Based Animation",
        description: "简易页面",
        image: require("./images/simplePortfolio.png")
    },
    {
        link: "#/physics",
        title: "Physics",
        description: "物理效果",
        image: require("./images/physics.png")
    },
    {
        link: "#/importedModels",
        title: "Imported Models",
        description: "狐狸🦊模型",
        image: require("./images/foxModel.png")
    },
    {
        link: "#/raycasterAndMouseEvent",
        title: "Raycaster And Mouse Event",
        description: "射线和鼠标事件",
        image: require("./images/raycaster.png")
    },
    {
        link: "#/environmentMap",
        title: "Environment Map",
        description: "环境贴图",
        image: require("./images/environmentMap.png")
    },
    {
        link: "#/shaders",
        title: "flag shaders",
        description: "旗帜",
        image: require("./images/flag.png")
    },
    {
        link: "#/helloBlender",
        title: "First Blender Exercise",
        description: "第一个Blender练习",
        image: require("./images/firstBlenderExercise.png")
    },
    {
        link: "https://upward7.github.io/marbleRace/",
        title: "Marble Race",
        description: "赛跑游戏",
        image: require("./images/marbleRace.png")
    },
    {
        link: "https://upward7.github.io/3d-gallery/dist/index.html",
        title: "3D虚拟展馆",
        description: "chiikawa画廊",
        image: require("./images/chiikawaGallery.png")
    }
]

export default class Home extends React.Component {
    render() {
        return (
            <div className="home_page" style={{ padding: "24px" }}>
                <Box>
                    <h1 className="page_title">ThreeJS Learning Outcomes</h1>
                </Box>
                <Box sx={{width: "100%", maxWidth: "1200px", margin: "auto"}}>
                    {/* 超小、小、中屏幕尺寸下列与列的间距 */}
                    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        {workList.map((item, index) => (
                            // 超小屏幕网格项占据全部12列，即一整行
                            <Grid item xs={12} sm={6} md={4} key={index} >
                                {/* 阴影高度为0，即没有阴影 */}
                                <Item elevation={0} className="grid_item">
                                    <MediaCard link={item.link} title={item.title} image={item.image} description={item.description} />
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        )
    }
}