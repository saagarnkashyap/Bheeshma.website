# Landing Animation TODO: Krishna and the Sudarshan Chakra

## Vision

Create a cinematic landing-page intro for the Bhagavad Gita website:

1. Krishna rises from his chariot.
2. He releases the Sudarshan Chakra toward the viewer.
3. The chakra grows as it travels toward the screen.
4. It reaches the camera and becomes the transition into the main home page.

The experience should feel reverent, dramatic, polished, and worthy of the subject—not like a generic loading animation.

## Recommended implementation

Use a short pre-rendered cinematic video as the primary animation rather than building the entire sequence in CSS or Three.js.

- Target duration: 8–12 seconds.
- Provide both WebM and MP4 versions.
- Use a poster image while the video loads.
- Navigate to `/` when the video ends.
- Add a visible “Skip intro” control.
- Add an “Enter site” fallback if playback fails.
- Keep audio off for autoplay; offer sound only after an explicit user interaction.
- Show the intro once per session using `sessionStorage` so returning visitors are not forced to replay it.

Example structure:

```jsx
<video
  autoPlay
  muted
  playsInline
  preload="metadata"
  poster="/assets/intro-poster.jpg"
  onEnded={() => navigate('/')}
>
  <source src="/assets/krishna-intro.webm" type="video/webm" />
  <source src="/assets/krishna-intro.mp4" type="video/mp4" />
</video>
```

## Performance and UX requirements

- Use a compressed 1080p master; avoid shipping 4K to mobile devices.
- Lazy-load the intro video only on the intro screen.
- Keep the asset small enough to avoid delaying access to the website.
- Respect `prefers-reduced-motion` and bypass the cinematic intro when requested.
- Provide a static poster/fallback for slow connections and unsupported playback.
- Ensure the home page remains usable if the video never loads.
- Test on mobile browsers, desktop browsers, and reduced-motion settings.

## Asset requirements

Before implementation, produce or obtain:

- Final cinematic video in WebM and MP4.
- Poster image for the first frame or a visually coherent still.
- Any optional sound effect or music track, activated only after user interaction.
- A clear transition frame where the chakra fills the screen.

## Implementation phases

1. Create a storyboard and visual direction.
2. Produce the cinematic video asset externally.
3. Build the intro route and responsive full-screen video shell.
4. Add loading, skip, fallback, reduced-motion, and once-per-session behavior.
5. Transition cleanly from the chakra impact into the home page.
6. Validate performance and playback across desktop and mobile.

## Acceptance criteria

- The intro feels intentional and cinematic at first load.
- The chakra impact transitions naturally into the home page.
- Users can skip the animation at any time.
- Reduced-motion users bypass it automatically.
- Slow or failed video loading never blocks access to the site.
- The animation does not replay unnecessarily during the same session.
- The experience remains smooth on mid-range mobile devices.

