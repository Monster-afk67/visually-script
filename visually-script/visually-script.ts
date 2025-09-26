/**
 * @fileOverview The main library file for Visually Script.
 * Contains the Presentation and Slide classes for programmatically building presentations.
 */

import type { MediaItem, PresentationSlide, SlideElement, SourceItem, TextSlideElement, ImageSlideElement, MathSlideElement, ShapeSlideElement } from './types';

// Helper to generate unique IDs
const generateId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Represents a custom slide that can be built and added to a presentation.
 */
export class Slide {
    private slide: PresentationSlide;

    constructor(title: string, backgroundColor: string = '#FFFFFF') {
        this.slide = {
            id: generateId(),
            title: title,
            backgroundColor: backgroundColor,
            elements: [],
        };
    }

    private addElement(element: SlideElement) {
        this.slide.elements.push(element);
        return this;
    }

    /**
     * Adds a text element to the slide.
     * @param {Partial<Omit<TextSlideElement, 'id' | 'type'>>} props - Text properties.
     */
    addText(props: Partial<Omit<TextSlideElement, 'id' | 'type'>>) {
        const defaults = {
            content: 'New Text',
            x: 10, y: 10, width: 300, height: 50,
            fontSize: 24, color: '#000000', fontFamily: 'Alegreya', animation: 'none'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'text' });
        return this;
    }
    
    /**
     * Adds an image element to the slide.
     * @param {Partial<Omit<ImageSlideElement, 'id' | 'type'>>} props - Image properties.
     */
    addImage(props: Partial<Omit<ImageSlideElement, 'id' | 'type'>>) {
        const defaults = {
            src: 'https://placehold.co/300x200.png',
            x: 10, y: 10, width: 300, height: 200
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'image' });
        return this;
    }
    
    /**
     * Adds a math/formula element to the slide.
     * @param {Partial<Omit<MathSlideElement, 'id' | 'type'>>} props - Math properties.
     */
    addMath(props: Partial<Omit<MathSlideElement, 'id' | 'type'>>) {
        const defaults = {
            content: 'E = mc^2',
            x: 10, y: 10, width: 200, height: 60,
            fontSize: 24, color: '#000000'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'math' });
        return this;
    }

    /**
     * Adds a shape element to the slide.
     * @param {Partial<Omit<ShapeSlideElement, 'id' | 'type'>>} props - Shape properties.
     */
    addShape(props: Partial<Omit<ShapeSlideElement, 'id' | 'type'>>) {
        const defaults = {
            shape: 'rectangle',
            x: 10, y: 10, width: 150, height: 100,
            strokeColor: '#000000', strokeWidth: 2, fillColor: 'transparent'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'shape' });
        return this;
    }

    /**
     * Sets the background color of the slide.
     * @param {string} color - A CSS hex color string (e.g., '#FFFFFF').
     */
    setBackgroundColor(color: string) {
        this.slide.backgroundColor = color;
        return this;
    }

    /**
     * Sets a background image for the slide.
     * @param {string} url - The URL of the background image.
     */
    setBackgroundImageUrl(url: string) {
        this.slide.backgroundImageUrl = url;
        return this;
    }

    /**
     * Returns the internal slide object.
     * @internal
     */
    getSlideObject(): PresentationSlide {
        return this.slide;
    }
}


/**
 * The main class for creating a Visually presentation.
 */
export class Presentation {
    private mediaQueue: MediaItem[] = [];
    private sources: SourceItem[] = [];

    addMediaItem(item: Omit<MediaItem, 'id'>) {
        this.mediaQueue.push({ ...item, id: generateId(), transition: item.transition || 'fade' });
        return this;
    }
    
    addPdf(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'pdf', currentPage: 1, ...props });
        return this;
    }
    
    addImage(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'image', ...props });
        return this;
    }
    
    addYouTube(props: { name: string; url: string; notes?: string; transition?: MediaItem['transition'] }) {
        const getYouTubeEmbedUrl = (url: string): string | null => {
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(youtubeRegex);
            return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
        };
        const embedUrl = getYouTubeEmbedUrl(props.url);
        if (embedUrl) {
            this.addMediaItem({ type: 'youtube', embedUrl, ...props });
        } else {
            console.warn(`Invalid YouTube URL provided, skipping: ${props.url}`);
        }
        return this;
    }

    addVideo(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'video', startTime: 0, timestamps: [], ...props });
        return this;
    }
    
    addUrl(props: { name: string; url: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'url', ...props });
        return this;
    }

    /**
     * Adds a custom slide to the presentation.
     * @param {Slide} slide - An instance of the Slide class.
     */
    addSlide(slide: Slide) {
        this.addMediaItem({
            type: 'created-slide',
            name: slide.getSlideObject().title,
            slide: slide.getSlideObject(),
        });
        return this;
    }

    addSource(source: Omit<SourceItem, 'id'>) {
        this.sources.push({ ...source, id: generateId() });
        return this;
    }

    /**
     * Exports the entire presentation to a JSON string compatible with Visually's import function.
     * @returns {string} The JSON representation of the presentation.
     */
    toJSON(): string {
        return JSON.stringify({
            mediaQueue: this.mediaQueue,
            sources: this.sources,
        }, null, 2);
    }
}
