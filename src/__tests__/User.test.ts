import { User } from '@/models/User';
import { CreateUserCommand } from '@/commands/CreateUserCommand';
import { UserFactory } from '@/factories/UserFactory';
import { UserMapper } from '@/mappers/UserMapper';

describe('User Model', () => {
  it('should create a user with required fields', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser'
    );

    expect(user.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.isActive).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a user with optional fields', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser',
      true,
      'John',
      'Doe'
    );

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.fullName).toBe('John Doe');
  });

  it('should update user fields', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser'
    );

    const originalUpdatedAt = user.updatedAt;
    
    user.update({
      email: 'newemail@example.com',
      firstName: 'Jane'
    });

    expect(user.email).toBe('newemail@example.com');
    expect(user.firstName).toBe('Jane');
    expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  it('should deactivate and activate user', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser'
    );

    expect(user.isActive).toBe(true);

    user.deactivate();
    expect(user.isActive).toBe(false);

    user.activate();
    expect(user.isActive).toBe(true);
  });
});

describe('CreateUserCommand', () => {
  it('should create a command with valid data', () => {
    const command = new CreateUserCommand({
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(command.email).toBe('test@example.com');
    expect(command.username).toBe('testuser');
    expect(command.firstName).toBe('John');
    expect(command.lastName).toBe('Doe');
    expect(command.timestamp).toBeInstanceOf(Date);
  });

  it('should validate command successfully', () => {
    const command = new CreateUserCommand({
      email: 'test@example.com',
      username: 'testuser'
    });

    expect(() => command.validate()).not.toThrow();
  });

  it('should throw error for invalid email', () => {
    const command = new CreateUserCommand({
      email: 'invalid-email',
      username: 'testuser'
    });

    expect(() => command.validate()).toThrow('Invalid email format');
  });

  it('should throw error for invalid username', () => {
    const command = new CreateUserCommand({
      email: 'test@example.com',
      username: 'test-user!'
    });

    expect(() => command.validate()).toThrow('Username must contain only letters, numbers, and underscores');
  });
});

describe('UserFactory', () => {
  it('should create user from command', () => {
    const command = new CreateUserCommand({
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe'
    });

    const user = UserFactory.createFromCommand(command);

    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.isActive).toBe(true);
    expect(user.id).toBeDefined();
  });

  it('should create user with specific ID', () => {
    const user = UserFactory.createWithId(
      '123e4567-e89b-12d3-a456-426614174000',
      {
        email: 'test@example.com',
        username: 'testuser'
      }
    );

    expect(user.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
  });
});

describe('UserMapper', () => {
  it('should map user to entity', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser',
      true,
      'John',
      'Doe'
    );

    const entity = UserMapper.toEntity(user);

    expect(entity.id).toBe(user.id);
    expect(entity.email).toBe(user.email);
    expect(entity.username).toBe(user.username);
    expect(entity.first_name).toBe(user.firstName);
    expect(entity.last_name).toBe(user.lastName);
    expect(entity.is_active).toBe(user.isActive);
    expect(entity.created_at).toBe(user.createdAt);
    expect(entity.updated_at).toBe(user.updatedAt);
  });

  it('should map entity to user', () => {
    const entity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const user = UserMapper.toDomain(entity);

    expect(user.id).toBe(entity.id);
    expect(user.email).toBe(entity.email);
    expect(user.username).toBe(entity.username);
    expect(user.firstName).toBe(entity.first_name);
    expect(user.lastName).toBe(entity.last_name);
    expect(user.isActive).toBe(entity.is_active);
    expect(user.createdAt).toBe(entity.created_at);
    expect(user.updatedAt).toBe(entity.updated_at);
  });

  it('should map user to DTO', () => {
    const user = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'test@example.com',
      'testuser',
      true,
      'John',
      'Doe'
    );

    const dto = UserMapper.toDTO(user);

    expect(dto.id).toBe(user.id);
    expect(dto.email).toBe(user.email);
    expect(dto.username).toBe(user.username);
    expect(dto.firstName).toBe(user.firstName);
    expect(dto.lastName).toBe(user.lastName);
    expect(dto.isActive).toBe(user.isActive);
    expect(dto.createdAt).toBe(user.createdAt);
    expect(dto.updatedAt).toBe(user.updatedAt);
  });
});
