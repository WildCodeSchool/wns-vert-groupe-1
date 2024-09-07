import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { ImageList, ImageListItem } from "@mui/material";
import { IconButton } from "@components";
import CloseIcon from "@mui/icons-material/Close";

export type ImagesCarouselProps = {
	images: string[];
	isEditable?: boolean;
};

export const ImagesCarousel: React.FC<ImagesCarouselProps> = ({
	images: initialImages,
	isEditable = false,
}) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);
	const [images, setImages] = useState<string[]>(initialImages);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
	};

	const handleImageDelete = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);

		if (selectedImageIndex === index) {
			setSelectedImageIndex(null);
		}
	};

	return (
		<>
			<Carousel
				autoPlay={true}
				index={selectedImageIndex !== null ? selectedImageIndex : undefined}
				sx={{ height: "45vh" }}
			>
				{images.map((imageUrl, i) => (
					<img
						key={i}
						src={imageUrl}
						style={{
							width: "100%",
							height: "45vh",
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
							style={{ borderRadius: "20px", height: "20vh" }}
							onClick={() => handleImageClick(i)}
						/>
						{isEditable ? (
							<IconButton
								icon={<CloseIcon />}
								color="secondary"
								onClick={() => handleImageDelete(i)}
								sx={{
									position: "absolute",
									top: 0,
									right: 0,
									borderRadius: "10px",
								}}
								rounded={false}
							/>
						) : (
							<></>
						)}
					</ImageListItem>
				))}
			</ImageList>
		</>
	);
};
