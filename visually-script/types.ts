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
    borderStyle?: 'none' | 'solid' | 'ants' | 'poop' | 'ants_normal' | 'ants_glow' | 'poop_normal' | 'poop_glow' | 'spiders' | 'spider_normal' | 'spider_glow';
    borderColor?: string;
    borderWidth?: number;
}

// Base for all elements that can be placed on a slide
export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'math' | 'shape' | 'gamification' | 'sticker';
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

export interface StickerSlideElement extends SlideElement {
    type: 'sticker';
    content: string; // The emoji character
    fontSize: number; // Controls the size
    rotation: number; // in degrees
}

// --- GAMIFICATION TYPES (for scripting) ---
export interface GamificationAction {
  id: string;
  type: 'text' | 'move' | 'wait';
  text?: string;
  targetX?: number;
  targetY?: number;
  duration?: number;
}

export interface GamificationElement extends SlideElement {
    type: 'gamification';
    character: 'char1' | 'char2' | 'char3' | 'char4' | 'char5' | 'char6' | 'character_7.png';
    actions: GamificationAction[];
}

// Represents a source/citation for the presentation
export interface SourceItem {
    id: string;
    title: string;
    url: string;
    notes?: string;
    tags?: string[];
}

// --- QUIZ TYPES (for scripting) ---
export interface QuizAnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  questionText: string;
  timer: number;
  options: QuizAnswerOption[];
}

export interface OpenTextQuestion {
    id: string;
    type: 'open-text';
    questionText: string;
    timer: number;
}

export type QuizQuestion = MultipleChoiceQuestion | OpenTextQuestion;

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

// --- CODE PROJECT TYPES (for scripting) ---
export interface CodeFile {
    id: string;
    name: string;
    language: 'html' | 'css' | 'javascript' | 'python' | 'rust';
    content: string;
}

export interface CodeProject {
    id: string;
    title: string;
    files: CodeFile[];
}

// --- QR CODE TYPES ---
export type QrCodeOptions = {
    width?: number;
    height?: number;
    margin?: number;
    qrOptions?: {
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    };
    dotsOptions?: {
        type?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
        color?: string;
    };
    cornersSquareOptions?: {
        type?: 'dot' | 'square' | 'extra-rounded';
        color?: string;
    };
    cornersDotOptions?: {
        type?: 'dot' | 'square';
        color?: string;
    };
    backgroundOptions?: {
        color?: string;
    };
    image?: string | null;
};
