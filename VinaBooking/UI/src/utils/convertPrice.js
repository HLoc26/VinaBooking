export default function convertPrice(price = 100, format = "vi-VN") {
	return new Intl.NumberFormat(format).format(price);
}
