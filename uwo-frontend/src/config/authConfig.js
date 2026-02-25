export const ROLE_CREDENTIALS = {
    admin: {
        email: 'admin@ai-auto.com',
        password: 'admin123',
        name: 'Super Admin'
    },
    builder: {
        email: 'builder@ai-auto.com',
        password: 'builder123',
        name: 'Elite Builder'
    },
    civil_engineer: {
        email: 'engineer@ai-auto.com',
        password: 'engineer123',
        name: 'Lead Engineer'
    },
    project_site: {
        email: 'manager@ai-auto.com',
        password: 'manager123',
        name: 'Site Manager'
    },
    client: {
        email: 'client@ai-auto.com',
        password: 'client123',
        name: 'Valued Client'
    }
};

export const findRoleByCredentials = (email, password) => {
    return Object.entries(ROLE_CREDENTIALS).find(([role, creds]) =>
        creds.email === email && creds.password === password
    );
};
