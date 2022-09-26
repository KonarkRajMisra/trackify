import { TemplateItem } from "./TemplateItem";

export interface Template{
    templateName: string | undefined,
    items: Array<TemplateItem> | undefined;
}