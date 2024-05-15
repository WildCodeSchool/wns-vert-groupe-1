import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { ImageList, ImageListItem } from "@mui/material";
import Image from "next/image";
export type ImagesCarouselProps = {
	images: string[];
};

export const ImagesCarousel: React.FC<ImagesCarouselProps> = ({ images }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
	};

	return (
		<>
			<Carousel
				autoPlay={true}
				index={selectedImageIndex !== null ? selectedImageIndex : undefined}
				sx={{ height: "60vh" }}
			>
				{images.map((imageUrl, i) => (
					<Image
						key={i}
						alt=""
						src={"/../imagesupload/uploads/1715765204632-MTU_accrochage 46_62.jpg"}
						style={{
							width: "100%",
							height: "55vh",
							objectFit: "cover",
							borderRadius: "45px",
						}}
						width={100}
						height={100}
					/>
				))}
			</Carousel>
			<ImageList cols={5}>
				{images.map((imageUrl, i) => (
					<ImageListItem key={i}>
						<Image
							alt=""
							src={imageUrl}
							loading="lazy"
							style={{ borderRadius: "20px" }}
							onClick={() => handleImageClick(i)}
							width={100}
							height={100}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</>
	);
};
