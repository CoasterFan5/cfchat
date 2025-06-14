<script lang="ts">
	const {
		color = '#ffffff'
	}: {
		color?: string;
	} = $props();
</script>

<div class="wrap">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 700 700"
		width="200"
		height="200"
		preserveAspectRatio="none"
		opacity="1"
		><defs
			><filter
				id="nnnoise-filter"
				x="-20%"
				y="-20%"
				width="140%"
				height="140%"
				filterUnits="objectBoundingBox"
				primitiveUnits="userSpaceOnUse"
				color-interpolation-filters="linearRGB"
			>
				<feTurbulence
					type="turbulence"
					baseFrequency="0.01"
					numOctaves="4"
					seed="13"
					stitchTiles="stitch"
					x="0%"
					y="0%"
					width="100%"
					height="100%"
					result="turbulence"
				></feTurbulence>
				<feSpecularLighting
					surfaceScale="20"
					specularConstant="1"
					specularExponent="20"
					lighting-color={color}
					x="0%"
					y="0%"
					width="100%"
					height="100%"
					in="turbulence"
					result="specularLighting"
				>
					<feDistantLight azimuth="3" elevation="81"></feDistantLight>
				</feSpecularLighting>
			</filter></defs
		><rect width="700" height="700" fill="#ffffff00"></rect><rect
			width="700"
			height="700"
			fill="#ffffff"
			filter="url(#nnnoise-filter)"
		></rect></svg
	>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
		opacity: 0.25;
	}

	svg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
	}
</style>
