# TODO: Cinematic Krishna Landing Intro

## Concept

Create a cinematic intro for the Bhagavad Gita website:

1. Krishna rises from his chariot.
2. He releases the Sudarshan Chakra toward the viewer.
3. The chakra grows until it fills the screen.
4. The impact transitions into the home page.

The tone should be reverent, dramatic, and polished.

## Implementation direction

Use a short pre-rendered video rather than a fully real-time Three.js/CSS scene.

- Duration: approximately 8–12 seconds.
- Provide WebM and MP4/H.264 versions.
- Use a poster image and keep autoplay muted.
- Navigate to `/` on completion.
- Add “Skip intro” and “Enter site” fallback controls.
- Show the intro once per session with `sessionStorage`.
- Enable sound only after explicit user interaction.

```jsx
<video autoPlay muted playsInline preload="metadata"
  poster="/assets/intro-poster.jpg"
  onEnded={() => navigate('/')}
>
  <source src="/assets/krishna-intro.webm" type="video/webm" />
  <source src="/assets/krishna-intro.mp4" type="video/mp4" />
</video>
```

## Responsiveness and performance

- Use a compressed 1080p desktop version; never ship 4K by default.
- Use a lighter 720p or 480p version for mobile/slow connections.
- If `Save-Data`, slow network, reduced motion, or video failure is detected, use the poster or go directly home.
- Lazy-load the video only on the intro route.
- Keep the home page usable and loading behind the intro.
- Avoid combining the video with heavy WebGL effects or particle systems.
- Test on Android phones, older Windows laptops, desktop browsers, and reduced-motion settings—not only Apple devices.

## Assets and completion criteria

Needed: final WebM/MP4 video, poster image, optional user-triggered audio, and a clear chakra-impact frame.

The intro is complete when it transitions smoothly, never blocks site access, can always be skipped, respects reduced motion, does not replay unnecessarily, and remains smooth on mid-range mobile hardware.

