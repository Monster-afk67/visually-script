/**
 * @fileOverview Defines the core data structures and types for the Visually Script library.
 * These types mirror the internal types of the Visually application to ensure compatibility.
 */

// Base interface for all items that can appear in the media queue
export interface MediaItem {
    id: string;
    type: string;
    name: string;
    notes?: string;
    transition?: 'fade' | 'slide' | 'zoom' | 'none';
    [key: string]: any; // Allow other properties
}

// Represents a created slide with various elements
export interface PresentationSlide {
    id: string;
    title: string;
    elements: SlideElement[];
    backgroundColor?: string;
    backgroundImageUrl?: string;
}

// Base for all elements that can be placed on a slide
export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'math' | 'shape';
    x: number;
    y: number;
    width: number;
    height: number;
}

// Specific types for each slide element
export interface TextSlideElement extends SlideElement {
    type: 'text';
    content: string;
    fontSize: number;
    color: string;
    fontFamily: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
    animation?: 'none' | 'fadeIn' | 'slideIn' | 'bounce' | 'typewriter';
}

export interface ImageSlideElement extends SlideElement {
    type: 'image';
    src: string;
    alt?: string;
}

export interface MathSlideElement extends SlideElement {
    type: 'math';
    content: string;
    fontSize: number;
    color: string;
}

export interface ShapeSlideElement extends SlideElement {
    type: 'shape';
    shape: 'rectangle' | 'arrow' | 'line';
    strokeColor: string;
    strokeWidth: number;
    fillColor?: string;
}

// Represents a source/citation for the presentation
export interface SourceItem {
    id: string;
    title: string;
    url: string;
    notes?: string;
    tags?: string[];
}
