import { Card, CardActionArea, CardContent, CardMedia, Link, Typography } from "@mui/material";

export default function MediaCard(props) {
    return (
        <Link href={props.link} target="_blank">
            {/* 基础容器，承载卡片内的所有内容 */}
            <Card>
                {/* 让卡片的特定区域可点击的容器 */}
                <CardActionArea>
                    {/* 用于展示图片、视频等媒体内容 */}
                    {/* alt占位符 */}
                    <CardMedia component="img" height="250" image={props.image} alt="green iguaua" />
                    <CardContent style={{textAlign: "left"}}>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    )
}