import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import AuthService from '../services/authService';

const retrieveTickets = async () => {
  try {
    const response = await fetch(
      '/api/tickets/',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthService.getAccessToken()}`
        }
      }
    );
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return [];
  }
};

const retrieveTicket = async (id: number | null): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthService.getAccessToken()}`
        }
      }
    );

    const data = await response.json();

    if(!response.ok) {
      throw new Error('Could not invalid API response, check network tab!');
    }
    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not fetch singular ticket');
  }
}

const createTicket = async (ticketData: Omit<TicketData, 'id'>): Promise<TicketData> => {
  try {
    const response = await fetch('/api/tickets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.getAccessToken()}`
      },
      body: JSON.stringify(ticketData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create ticket');
    }

    return data;
  } catch (err) {
    console.error('Error creating ticket:', err);
    throw err;
  }
};

const updateTicket = async (id: number, ticketData: Partial<TicketData>): Promise<TicketData> => {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.getAccessToken()}`
      },
      body: JSON.stringify(ticketData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ticket');
    }

    return data;
  } catch (err) {
    console.error('Error updating ticket:', err);
    throw err;
  }
};

const deleteTicket = async (id: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.getAccessToken()}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete ticket');
    }

    return data;
  } catch (err) {
    console.error('Error deleting ticket:', err);
    throw err;
  }
};

export { retrieveTickets, retrieveTicket, createTicket, updateTicket, deleteTicket };
