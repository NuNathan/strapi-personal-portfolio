import type { Schema, Struct } from '@strapi/strapi';

export interface ExperienceJob extends Struct.ComponentSchema {
  collectionName: 'components_experience_jobs';
  info: {
    displayName: 'job';
    icon: 'briefcase';
  };
  attributes: {
    company: Schema.Attribute.String;
    location: Schema.Attribute.Enumeration<['On-site', 'Hybrid', 'Remote']>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ExperienceSchool extends Struct.ComponentSchema {
  collectionName: 'components_experience_schools';
  info: {
    displayName: 'school';
    icon: 'book';
  };
  attributes: {
    degree: Schema.Attribute.String & Schema.Attribute.Required;
    gpa: Schema.Attribute.Decimal;
    school: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'experience.job': ExperienceJob;
      'experience.school': ExperienceSchool;
    }
  }
}
