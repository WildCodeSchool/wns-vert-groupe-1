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
				sx={{ height: "50vh" }}
			>
				{images.map((imageUrl, i) => (
					<img
						key={i}
						src={imageUrl}
						style={{
							width: "100%",
							height: "50vh",
							objectFit: "cover",
							borderRadius: "45px",
						}}
					/>
				))}
			</Carousel>
			<ImageList cols={5}>
				{images.map((imageUrl, i) => (
					<ImageListItem key={i}>
						<img
							src={imageUrl}
							loading="lazy"
							style={{ borderRadius: "20px" }}
							onClick={() => handleImageClick(i)}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</>
	);
};
