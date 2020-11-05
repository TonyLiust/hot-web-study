function randomInt( min, max ) {
	return Math.round(randomFloat(min, max));
}
function randomFloat( min, max ) {
	return Math.random() * ( max - min ) + min;
}
function degreesToRads(degrees) {
	return degrees / 180 * Math.PI;
}
function lerp_easeInOutCubic(normal,min,max){
  normal = easeInOutCubic(normal);
  return min + (max - min)*normal;
}
function normal(value,min,max){
  return (value - min)/(max - min);
}
function easeInOutCubic(nor){
    if ((nor/=0.5) < 1)
			return 0.5*Math.pow(nor,3);
    else
    	return 0.5 * (Math.pow((nor-2),3) + 2);
}
