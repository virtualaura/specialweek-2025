/**
 * TasksEmailer.js - A utility to generate emails from task data
 */

class TasksEmailer {
    constructor() {
        this.contacts = [];
        this.tasks = [];
    }

    /**
     * Load data from CSV files
     * @returns {Promise} Promise resolving when data is loaded
     */
    async loadData() {
        try {
            // Load contacts
            const contactsResponse = await fetch('public/contacts.csv');
            if (!contactsResponse.ok) {
                throw new Error(`Failed to load contacts.csv: ${contactsResponse.status}`);
            }
            const contactsCSV = await contactsResponse.text();
            this.contacts = this.parseContacts(contactsCSV);
            
            // Load tasks
            const tasksResponse = await fetch('public/tasks.csv');
            if (!tasksResponse.ok) {
                throw new Error(`Failed to load tasks.csv: ${tasksResponse.status}`);
            }
            const tasksCSV = await tasksResponse.text();
            this.tasks = this.parseTasks(tasksCSV);
            
            return {
                contacts: this.contacts,
                tasks: this.tasks
            };
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    /**
     * Parse contacts from CSV text
     * @param {string} csvText - CSV content with name, email format
     * @returns {Array} Array of contact objects
     */
    parseContacts(csvText) {
        if (!csvText) return [];
        
        const lines = csvText.trim().split('\n');
        return lines.map(line => {
            const [name, email] = line.split(',').map(item => item.trim());
            return { name, email };
        }).filter(contact => contact.name && contact.email);
    }

    /**
     * Parse tasks from CSV text
     * @param {string} csvText - CSV content with task data
     * @returns {Array} Array of task objects
     */
    parseTasks(csvText) {
        if (!csvText) return [];
        
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const task = {};
            
            headers.forEach((header, index) => {
                task[header] = values[index] ? values[index].trim() : '';
            });
            
            return task;
        }).filter(task => task.description);
    }

    /**
     * Find email address for a person's name
     * @param {string} name - Person's name to look up
     * @returns {string|null} Email address or null if not found
     */
    findEmailForPerson(name) {
        const contact = this.contacts.find(c => 
            c.name.toLowerCase() === name.toLowerCase().trim()
        );
        return contact ? contact.email : null;
    }

    /**
     * Generate email data for all tasks
     * @param {string} subjectTemplate - Email subject template
     * @param {string} bodyTemplate - Email body template
     * @returns {Array} Array of email objects
     */
    generateEmailsForTasks(subjectTemplate, bodyTemplate) {
        const emails = [];

        this.tasks.forEach(task => {
            // Handle multiple assignees separated by semicolons
            const assignees = task.who ? task.who.split(';').map(name => name.trim()) : [];
            const ccPeople = task.cc ? task.cc.split(';').map(name => name.trim()) : [];
            
            // For each assignee
            assignees.forEach(assignee => {
                const email = this.findEmailForPerson(assignee);
                if (!email) return; // Skip if no email found
                
                // Find CC emails
                const ccEmails = ccPeople
                    .map(name => this.findEmailForPerson(name))
                    .filter(email => email);
                
                // Replace template variables
                let subject = subjectTemplate.replace(/{{(\w+)}}/g, (match, variable) => {
                    return task[variable] || match;
                });
                
                let body = bodyTemplate.replace(/{{(\w+)}}/g, (match, variable) => {
                    if (variable === 'name') return assignee;
                    return task[variable] || match;
                });
                
                emails.push({
                    to: email,
                    cc: ccEmails.join(','),
                    subject,
                    body,
                    task,
                    assignee
                });
            });
        });
        
        return emails;
    }

    /**
     * Open email client with prepared email
     * @param {string} to - Recipient email
     * @param {string} cc - CC recipients
     * @param {string} subject - Email subject
     * @param {string} body - Email body
     */
    static openEmailClient(to, cc, subject, body) {
        let mailtoLink = `mailto:${to}`;
        
        const params = [];
        if (cc) params.push(`cc=${cc}`);
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        
        if (params.length > 0) {
            mailtoLink += '?' + params.join('&');
        }
        
        window.location.href = mailtoLink;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TasksEmailer;
}
