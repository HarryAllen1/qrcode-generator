<script lang="ts">
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';
	import { page } from '$app/stores';

	const exampleResponse = `{
  "data": "Data URL of base64 encoded image or svg xml if the format is svg or unicode for the terminal thing"
}`;
</script>

<h1>QRCode API</h1>
<DarkModeSwitch />

<p>This site has an API that allows developers to easily generate QR codes.</p>
<p>Headers are not required to use the API</p>
<p>The endpoint for this api is <code>https://{$page.url.host}/generateQrcode</code></p>
<p>Example response (in JSON):</p>
<pre>{exampleResponse}</pre>

<h2>Required URL Params</h2>
<ul>
	<li><code>text</code></li>
	<ul>
		<li>The URI-encoded text to generate the QR code for</li>
		<li>
			Tip: Encode the text for this parameter by using the <code>encodeURIComponent</code> function
		</li>
	</ul>
	<li><code>format</code></li>
	<ul>
		<li>The format of the returned image. Can be one of the following:</li>
		<ul>
			<li>
				<code>svg, png, jpg, jpeg, webp, avif, gif, tif, tiff, terminal</code>
			</li>
		</ul>
	</ul>
	<li><code>size</code></li>
	<ul>
		<li>
			The size of the one side of the QR code in pixels. Only required if the format is not <code>
				svg
			</code>
			or <code>terminal</code>
		</li>
	</ul>
</ul>

<h2>Optional URL Params</h2>
<ul>
	<li><code>margin</code></li>
	<ul><li>The white margin around the main QR code.</li></ul>
</ul>
