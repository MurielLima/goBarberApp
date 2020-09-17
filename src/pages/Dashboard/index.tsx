import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/styles.css'
import Link from 'react-router-dom';
import { Container, Header, HeaderContent, Profile, Content, Schedule,NextAppointment,Section,Appointment, Calendar} from './styles';
import logoImg from '../../assets/logo.svg'
import api from '../../services/api';

interface MonthAvailabilityItem{
    day:number;
    available:boolean;
}
interface AppointmentItem{
    id:string;
    date:string;
    user:{
        name:string;
        avatar_url:string;
    }
}

const Dashboard: React.FC = () =>{
    const {user, signOut} = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem>([]);
    const [ appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const handleDateChange = useCallback((day: Date, modifiers:DayModifiers)=>{
        if(modifiers.available && !modifiers.disabled){
            setSelectedDate(day);
        }
    },[]);
    const handleMonthChange = useCallback((month: Date)=>{
            setSelectedMonth(day);
    },[]);
    useEffect(()=>{
        api.get(`/providers/${user.id}/month-avilability`,{
            params:{
                year:currentMonth.getFullYear(),
                month:currentMonth.getFullMonth() + 1
            }}).then(response =>{
                setMonthAvailability(response.data);
        });
    },[currentMonth, user.id]);

    const disabledDays = useMemo(()=>{
        const dates = monthAvailability
        .filter(monthDay => monthDay.available === false)
        .map(monthDay =>{
            const year = currentMonth.getFullYear();
            const month =  currentMonth.getMonth();
            const date = new Date(year, month, monthDay.day);
        })
    },[currentMonth, monthAvailability]);
    const selectedDateAsText = useMemo(()=>{
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale:ptBR
        });
    },[selectedDate]);
    const selectedWeekDay = useMemo(()=>{
        return format(selectedDate, 'cccc', {
            locale:ptBR
        });
    },[selectedDate]);
    useEffect(()=>{
        api.get<AppointmentItem[]>('/appointments/me',()=>{
            params:{
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth(),
                day: selectedDate.getDay()
            }
        }).then(response=>{
            const appointmentsFormatted = response.data.map(appointment=>{
                return {
                    ...appointment,
                    hourFormatted: format(parseISO(appointment.date), 'HH:mm')
                }
            })
            setAppointments(response.data);
        })
    },[selectedDate]);
    const morningAppointments = useMemo(()=>{
       return appointments.filter(appointment => {
           return parseISO(appointment.date).getHours()<12;
       }) 
    }[appointments]);
    const afternoonAppointments = useMemo(()=>{
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours()>=12;
        }) 
     },[appointments]);
     const nextAppointment = useMemo(()=>{
         return appointments.find(appointments =>
            isAfter(parseISO(appointment.date)));
     }, [appointments]);
    return (
        <>
    <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />
                    <Profile>
                        <img
                            src={user.avar_url}
                            alt={user.name} />
                        <div>
                            <span>Bem-vindo,</span>
                            <Link to="/profile"><strong>{user.name}</strong></Link>
                        </div>
                    </Profile>
                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>
            <Content>
            {isToday(selectedDate) &&  <span>Hoje</span>}
                <span>{selectedDateAsText}</span>
                <span>{selectedWeekDay}</span>
            </p>
            {isToday(selectedDate) && nextAppointment &&
             <NextAppointment>
                <strong>Atendimento a seguir</strong>
                <div>
                    <img src="" alt="" />
                    <strong>
                        {nextAppointment.user.name}
                    </strong>
                    <span>
                        <FiClock />
                        {nextAppointment.hourFormatted}
                    </span>
                </div>
            </NextAppointment>
}
            <Section>
                <strong>
                    Manhã
                </strong>
                {morningAppointments.length === 0 && (
                    <p>Nenhum agendamento neste período</p>
                )}
                {morningAppointments.map(appointment =>(
                <Appointment key={appointment.id}>
                    <span>
                        <FiClock />
                        {appointment.hourFormatted}
                    </span>
                    <div>
                        <img src={appointment.user.avar_url} alt={appointment.user.name} />
                        <strong>
                            {appointment.user.name}
                        </strong>
                    </div>
                </Appointment>
                ))}
            </Section>
            <Section>
                <strong>
                    Tarde
                </strong>
                {afternoonAppointments.map(appointment =>(
                <Appointment key={appointment.id}>
                    <span>
                        <FiClock />
                        {appointment.hourFormatted}
                    </span>
                    <div>
                        <img src={appointment.user.avar_url} alt={appointment.user.name} />
                        <strong>
                            {appointment.user.name}
                        </strong>
                    </div>
                </Appointment>
                ))}
            </Section>
        </Schedule>
            <Calendar>
                <DayPicker
                    weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S']}
                    months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                    fromMonth={new Date()}
                    disableDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                    modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
                    onDayClick={handleDateChange}
                    onMonthChange={handleMonthChange}
                    selectedDays={selectedDate} />
            </Calendar>
        </Content>
    </Container>
    </>);
};
export default Dashboard;